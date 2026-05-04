import { useEffect, useRef, useState } from 'react'
import { ArrowLeftIcon } from '@phosphor-icons/react'
import { Helmet } from '@dr.pogodin/react-helmet'
import { useBlocker, useNavigate, useParams } from 'react-router'
import { gooeyToast } from '@/components/ui/goey-toaster'
import { VocabularyUpsertForm } from '@/components/vocabulary/VocabularyUpsertForm'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { ADMIN_VOCABULARY_CONTENT } from '@/constants/adminContent'
import { useVocabularyAdminDetail } from '@/hooks/useVocabularyAdminDetail'
import { useVocabularyAdminMutations } from '@/hooks/useVocabularyAdminMutations'
import type { VocabularyAdminDetail, VocabularyUpsertPayload } from '@/types/vocabularyAdmin'

export function AdminVocabularyEditorPage() {
  const navigate = useNavigate()
  const { id } = useParams<{ id: string }>()
  const isEditMode = Boolean(id)

  const [isDirty, setIsDirty] = useState(false)
  const [isLeaveConfirmOpen, setIsLeaveConfirmOpen] = useState(false)
  const [initialData, setInitialData] = useState<VocabularyAdminDetail | null>(null)
  const [isLoadFailed, setIsLoadFailed] = useState(false)
  const [pendingNavigationPath, setPendingNavigationPath] = useState<string | null>(null)
  const allowNavigationRef = useRef(false)

  const blocker = useBlocker(({ currentLocation, nextLocation }) => {
    if (allowNavigationRef.current) return false
    if (!isDirty) return false

    const currentPath = `${currentLocation.pathname}${currentLocation.search}${currentLocation.hash}`
    const nextPath = `${nextLocation.pathname}${nextLocation.search}${nextLocation.hash}`
    return currentPath !== nextPath
  })

  const { fetchDetail, isLoadingDetail } = useVocabularyAdminDetail()
  const { createMutation, updateMutation, getApiErrorMessage } = useVocabularyAdminMutations()

  const isLeaveDialogOpen = isLeaveConfirmOpen || blocker.state === 'blocked'
  const blockedNavigationPath =
    blocker.state === 'blocked'
      ? `${blocker.location.pathname}${blocker.location.search}${blocker.location.hash}`
      : null

  useEffect(() => {
    const handleBeforeUnload = (event: BeforeUnloadEvent) => {
      if (!isDirty) return
      event.preventDefault()
      event.returnValue = ''
    }

    window.addEventListener('beforeunload', handleBeforeUnload)
    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload)
    }
  }, [isDirty])

  useEffect(() => {
    if (!isEditMode || !id) {
      return
    }

    const loadDetail = async () => {
      try {
        const detail = await fetchDetail(id)
        setInitialData(detail)
        setIsLoadFailed(false)
      } catch (detailError) {
        setIsLoadFailed(true)
        gooeyToast.error(getApiErrorMessage(detailError, ADMIN_VOCABULARY_CONTENT.toast.crudErrorFallback))
      }
    }

    void loadDetail()
  }, [fetchDetail, getApiErrorMessage, id, isEditMode])

  const navigateToList = () => {
    navigate('/admin/vocabulary')
  }

  const handleBackAction = () => {
    if (!isDirty) {
      navigateToList()
      return
    }

    setPendingNavigationPath('/admin/vocabulary')
    setIsLeaveConfirmOpen(true)
  }

  const handleSubmit = async (payload: VocabularyUpsertPayload) => {
    try {
      if (isEditMode && id) {
        await updateMutation.mutateAsync({ id, payload })
        gooeyToast.success(ADMIN_VOCABULARY_CONTENT.toast.updateSuccess)
      } else {
        await createMutation.mutateAsync(payload)
        gooeyToast.success(ADMIN_VOCABULARY_CONTENT.toast.createSuccess)
      }

      allowNavigationRef.current = true

      if (blocker.state === 'blocked') {
        blocker.proceed()
        return
      }

      if (blockedNavigationPath) {
        navigate(blockedNavigationPath)
      } else if (pendingNavigationPath) {
        navigate(pendingNavigationPath)
      } else {
        navigateToList()
      }
    } catch (submitError) {
      gooeyToast.error(getApiErrorMessage(submitError, ADMIN_VOCABULARY_CONTENT.toast.crudErrorFallback))
      throw submitError
    }
  }

  const pageTitle = isEditMode ? ADMIN_VOCABULARY_CONTENT.editor.editPageTitle : ADMIN_VOCABULARY_CONTENT.editor.createPageTitle
  const pageDescription = isEditMode ? ADMIN_VOCABULARY_CONTENT.editor.editDescription : ADMIN_VOCABULARY_CONTENT.editor.createDescription
  const isSubmitting = createMutation.isPending || updateMutation.isPending

  return (
    <>
      <Helmet>
        <title>{pageTitle}</title>
      </Helmet>

      <section className="space-y-6">
        <header className="space-y-3">
          <Button type="button" variant="outline" onClick={handleBackAction}>
            <ArrowLeftIcon size={16} />
            {ADMIN_VOCABULARY_CONTENT.backToListLabel}
          </Button>

          <div className="space-y-1">
            <h2 className="font-heading-vn text-2xl font-bold" style={{ color: 'var(--on-surface)' }}>
              {pageTitle}
            </h2>
            <p className="text-sm" style={{ color: 'var(--on-surface-variant)' }}>
              {pageDescription}
            </p>
          </div>
        </header>

        {isLoadFailed ? (
          <p className="text-sm" style={{ color: 'var(--on-surface-variant)' }}>
            {ADMIN_VOCABULARY_CONTENT.editor.notFoundLabel}
          </p>
        ) : (
          <VocabularyUpsertForm
            open={true}
            onOpenChange={(open) => {
              if (!open) {
                handleBackAction()
              }
            }}
            mode={isEditMode ? 'edit' : 'create'}
            initialData={initialData}
            isLoadingDetail={isLoadingDetail}
            isSubmitting={isSubmitting}
            onSubmit={handleSubmit}
            onDirtyChange={setIsDirty}
          />
        )}
      </section>

      <Dialog
        open={isLeaveDialogOpen}
        onOpenChange={(open) => {
          if (!open) {
            if (blocker.state === 'blocked') {
              blocker.reset()
            }
            setPendingNavigationPath(null)
          }

          setIsLeaveConfirmOpen(open)
        }}
      >
        <DialogContent className="sm:max-w-[520px]">
          <DialogHeader>
            <DialogTitle>{ADMIN_VOCABULARY_CONTENT.editor.confirmLeaveTitle}</DialogTitle>
            <DialogDescription>{ADMIN_VOCABULARY_CONTENT.editor.confirmLeaveDescription}</DialogDescription>
          </DialogHeader>

          <div className="flex flex-wrap gap-2">
            <Button
              type="button"
              onClick={() => {
                allowNavigationRef.current = true

                if (blocker.state === 'blocked') {
                  blocker.proceed()
                  return
                }

                if (pendingNavigationPath) {
                  navigate(pendingNavigationPath)
                } else {
                  navigateToList()
                }
              }}
              disabled={isSubmitting || isLoadingDetail}
            >
              {ADMIN_VOCABULARY_CONTENT.editor.confirmLeaveDiscardLabel}
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={() => {
                if (blocker.state === 'blocked') {
                  blocker.reset()
                }
                setPendingNavigationPath(null)
                setIsLeaveConfirmOpen(false)
              }}
            >
              {ADMIN_VOCABULARY_CONTENT.editor.confirmLeaveStayLabel}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  )
}
