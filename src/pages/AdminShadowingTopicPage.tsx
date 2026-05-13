import { ChartBarIcon, InfoIcon, ListIcon } from '@phosphor-icons/react'
import { useEffect, useRef, useState } from 'react'
import { Helmet } from '@dr.pogodin/react-helmet'
import { useNavigate, useParams } from 'react-router'
import { ShadowingAddSentenceDialog } from '@/components/shadowing/ShadowingAddSentenceDialog'
import { ShadowingConfirmDialog } from '@/components/shadowing/ShadowingConfirmDialog'
import { ShadowingTopicAnalyticsSection } from '@/components/shadowing/ShadowingTopicAnalyticsSection'
import { ShadowingTopicFormDialog } from '@/components/shadowing/ShadowingTopicFormDialog'
import { ShadowingTopicHeader } from '@/components/shadowing/ShadowingTopicHeader'
import { ShadowingTopicInfoSection } from '@/components/shadowing/ShadowingTopicInfoSection'
import { ShadowingTopicSentencesSection } from '@/components/shadowing/ShadowingTopicSentencesSection'
import { Button } from '@/components/ui/button'
import { gooeyToast } from '@/components/ui/goey-toaster'
import { Skeleton } from '@/components/ui/skeleton'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { SHADOWING_ADMIN_CONTENT } from '@/constants/shadowingAdmin'
import { useShadowingAdminMutations } from '@/hooks/useShadowingAdminMutations'
import {
  useAvailableSentences,
  useSentenceAnalytics,
  useShadowingTopicDetail,
  useTopicAnalytics,
} from '@/hooks/useShadowingAdminQueries'
import { resolveApiMediaUrl } from '@/lib/mediaUrl'
import { resourceService } from '@/services/resourceService'
import type { ShadowingLevel, ShadowingStatus, ShadowingVisibility } from '@/types/shadowingAdmin'

export function AdminShadowingTopicPage() {
  const navigate = useNavigate()
  const { id } = useParams<{ id: string }>()
  const topicId = id ?? ''
  const [activeTab, setActiveTab] = useState('info')
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [isAddSentenceDialogOpen, setIsAddSentenceDialogOpen] = useState(false)
  const [pendingDeleteSentenceId, setPendingDeleteSentenceId] = useState<string | null>(null)
  const [availableSearchQuery, setAvailableSearchQuery] = useState('')
  const [playingAudioUrl, setPlayingAudioUrl] = useState<string | null>(null)
  const audioRef = useRef<HTMLAudioElement | null>(null)

  const topicQuery = useShadowingTopicDetail(topicId)
  const availableSentencesQuery = useAvailableSentences(topicId, {
    q: availableSearchQuery,
    pageSize: 50,
  })
  const topicAnalyticsQuery = useTopicAnalytics(topicId)
  const sentenceAnalyticsQuery = useSentenceAnalytics(topicId)

  const {
    removeSentenceMutation,
    attachSentenceMutation,
    updateTopicMutation,
    getApiErrorMessage,
  } = useShadowingAdminMutations()

  const topic = topicQuery.data
  const availableSentences = availableSentencesQuery.data?.items ?? []
  const topicAnalytics = topicAnalyticsQuery.data
  const sentenceAnalytics = sentenceAnalyticsQuery.data ?? []

  useEffect(() => {
    return () => {
      if (audioRef.current) {
        audioRef.current.pause()
        audioRef.current = null
      }
    }
  }, [])

  async function handlePlayAudio(audioUrl?: string | null) {
    const resolvedAudioUrl = resolveApiMediaUrl(audioUrl)
    if (!resolvedAudioUrl) return

    const currentAudio = audioRef.current
    const isSameAudio = playingAudioUrl === resolvedAudioUrl && currentAudio && !currentAudio.paused
    if (isSameAudio) {
      currentAudio.pause()
      currentAudio.currentTime = 0
      audioRef.current = null
      setPlayingAudioUrl(null)
      return
    }

    if (audioRef.current) {
      audioRef.current.pause()
      audioRef.current.currentTime = 0
    }

    const audio = new Audio(resolvedAudioUrl)
    audioRef.current = audio
    setPlayingAudioUrl(resolvedAudioUrl)
    audio.onended = () => {
      if (audioRef.current === audio) {
        audioRef.current = null
        setPlayingAudioUrl(null)
      }
    }

    try {
      await audio.play()
    } catch {
      if (audioRef.current === audio) {
        audioRef.current = null
        setPlayingAudioUrl(null)
      }
    }
  }

  async function handleUploadCoverImage(file: File) {
    const { data } = await resourceService.uploadImage(file)
    return data.data.fileUrl
  }

  async function handleUpdateTopic(payload: {
    title: string
    description: string
    coverImageUrl?: string
    level?: ShadowingLevel
    visibility: ShadowingVisibility
    status: ShadowingStatus
  }) {
    if (!topic) return

    try {
      await updateTopicMutation.mutateAsync({ topicId: topic.id, payload })
      gooeyToast.success(SHADOWING_ADMIN_CONTENT.topicUpdatedSuccess)
      setIsEditDialogOpen(false)
    } catch (error) {
      gooeyToast.error(
        getApiErrorMessage(error, SHADOWING_ADMIN_CONTENT.updateTopicFailedFallback),
      )
    }
  }

  async function handleRemoveSentence(sentenceId: string) {
    try {
      await removeSentenceMutation.mutateAsync({ topicId, sentenceId })
      gooeyToast.success(SHADOWING_ADMIN_CONTENT.sentenceRemovedSuccess)
    } catch (error) {
      gooeyToast.error(
        getApiErrorMessage(error, SHADOWING_ADMIN_CONTENT.deleteSentenceFailedFallback),
      )
    }
  }

  async function handleAttachSentence(sentenceId: string, position: number) {
    try {
      await attachSentenceMutation.mutateAsync({
        topicId,
        payload: { sentenceId, position, note: '' },
      })
      gooeyToast.success(SHADOWING_ADMIN_CONTENT.sentenceAttachedSuccess)
    } catch (error) {
      gooeyToast.error(
        getApiErrorMessage(error, SHADOWING_ADMIN_CONTENT.attachSentenceFailedFallback),
      )
    }
  }

  if (topicQuery.isLoading) {
    return (
      <div className="space-y-6">
        <div className="flex items-start gap-3">
          <Skeleton className="size-10 rounded-md" />
          <Skeleton className="size-12 rounded-md" />
          <div className="flex-1 space-y-2">
            <Skeleton className="h-7 w-64" />
            <Skeleton className="h-4 w-40" />
          </div>
          <Skeleton className="h-9 w-24" />
        </div>
        <Skeleton className="h-10 w-72" />
        <Skeleton className="h-64 w-full rounded-lg" />
      </div>
    )
  }

  if (!topic) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground">{SHADOWING_ADMIN_CONTENT.emptyDescription}</p>
        <Button className="mt-4" onClick={() => navigate('/admin/shadowing')}>
          {SHADOWING_ADMIN_CONTENT.backToList}
        </Button>
      </div>
    )
  }

  return (
    <>
      <Helmet>
        <title>
          {topic.title} | {SHADOWING_ADMIN_CONTENT.pageTitle} | Tacho Admin
        </title>
      </Helmet>

      <div className="space-y-6">
        <ShadowingTopicHeader
          title={topic.title}
          description={topic.description}
          coverImageUrl={topic.coverImageUrl}
          status={topic.status}
          onBack={() => navigate('/admin/shadowing')}
          onEdit={() => setIsEditDialogOpen(true)}
        />

        <ShadowingTopicFormDialog
          mode="edit"
          open={isEditDialogOpen}
          onOpenChange={setIsEditDialogOpen}
          topic={topic}
          isPending={updateTopicMutation.isPending}
          onUploadCoverImage={handleUploadCoverImage}
          onSubmit={handleUpdateTopic}
        />

        <ShadowingAddSentenceDialog
          open={isAddSentenceDialogOpen}
          onOpenChange={setIsAddSentenceDialogOpen}
          searchQuery={availableSearchQuery}
          onSearchQueryChange={setAvailableSearchQuery}
          isLoading={availableSentencesQuery.isLoading}
          isAttaching={attachSentenceMutation.isPending}
          availableSentences={availableSentences}
          topic={topic}
          onAttachSentence={(sentenceId, position) => {
            void handleAttachSentence(sentenceId, position)
          }}
        />

        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
          <TabsList>
            <TabsTrigger value="info">
              <InfoIcon size={20} />
              {SHADOWING_ADMIN_CONTENT.basicInfoTab}
            </TabsTrigger>
            <TabsTrigger value="sentences">
              <ListIcon size={20} />
              {SHADOWING_ADMIN_CONTENT.sentencesTab}
            </TabsTrigger>
            <TabsTrigger value="analytics">
              <ChartBarIcon size={20} />
              {SHADOWING_ADMIN_CONTENT.analyticsTab}
            </TabsTrigger>
          </TabsList>

          <TabsContent value="info" className="space-y-4">
            <ShadowingTopicInfoSection topic={topic} />
          </TabsContent>

          <TabsContent value="sentences" className="space-y-4">
            <ShadowingTopicSentencesSection
              topic={topic}
              isRemoving={removeSentenceMutation.isPending}
              playingAudioUrl={playingAudioUrl}
              onPlayAudio={(url) => { void handlePlayAudio(url) }}
              onAddSentence={() => setIsAddSentenceDialogOpen(true)}
              onDeleteSentence={setPendingDeleteSentenceId}
            />
          </TabsContent>

          <TabsContent value="analytics" className="space-y-4">
            <ShadowingTopicAnalyticsSection
              isLoadingTopicAnalytics={topicAnalyticsQuery.isLoading}
              isLoadingSentenceAnalytics={sentenceAnalyticsQuery.isLoading}
              topicAnalytics={topicAnalytics}
              sentenceAnalytics={sentenceAnalytics}
            />
          </TabsContent>
        </Tabs>

        <ShadowingConfirmDialog
          open={Boolean(pendingDeleteSentenceId)}
          title={SHADOWING_ADMIN_CONTENT.deleteSentenceConfirmTitle}
          description={SHADOWING_ADMIN_CONTENT.deleteSentenceConfirmMessage}
          isPending={removeSentenceMutation.isPending}
          onOpenChange={(open) => {
            if (!open) setPendingDeleteSentenceId(null)
          }}
          onConfirm={() => {
            if (!pendingDeleteSentenceId) return
            void handleRemoveSentence(pendingDeleteSentenceId).finally(() => setPendingDeleteSentenceId(null))
          }}
        />
      </div>
    </>
  )
}
