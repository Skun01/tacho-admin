import { PlusIcon } from '@phosphor-icons/react'
import { useState } from 'react'
import { Helmet } from '@dr.pogodin/react-helmet'
import { ShadowingAdminFilters } from '@/components/shadowing/ShadowingAdminFilters'
import { ShadowingAdminTable } from '@/components/shadowing/ShadowingAdminTable'
import { ShadowingConfirmDialog } from '@/components/shadowing/ShadowingConfirmDialog'
import { ShadowingTopicFormDialog } from '@/components/shadowing/ShadowingTopicFormDialog'
import { Button } from '@/components/ui/button'
import { gooeyToast } from '@/components/ui/goey-toaster'
import { SHADOWING_ADMIN_CONTENT } from '@/constants/shadowingAdmin'
import { useAdminShadowingPageState } from '@/hooks/useAdminShadowingPageState'
import { useShadowingAdminMutations } from '@/hooks/useShadowingAdminMutations'
import { resourceService } from '@/services/resourceService'
import type { ShadowingLevel, ShadowingStatus, ShadowingVisibility } from '@/types/shadowingAdmin'

export function AdminShadowingPage() {
  const state = useAdminShadowingPageState()
  const [pendingDeleteTopicId, setPendingDeleteTopicId] = useState<string | null>(null)
  const { createTopicMutation, deleteTopicMutation, getApiErrorMessage } = useShadowingAdminMutations()

  async function handleUploadCoverImage(file: File) {
    const { data } = await resourceService.uploadImage(file)
    return data.data.fileUrl
  }

  async function handleCreateTopic(payload: {
    title: string
    description: string
    coverImageUrl?: string
    level?: ShadowingLevel
    visibility: ShadowingVisibility
    status: ShadowingStatus
  }) {
    try {
      await createTopicMutation.mutateAsync(payload)
      gooeyToast.success(SHADOWING_ADMIN_CONTENT.topicCreatedSuccess)
      state.handleCloseCreate()
    } catch (error) {
      gooeyToast.error(
        getApiErrorMessage(error, SHADOWING_ADMIN_CONTENT.createTopicFailedFallback),
      )
    }
  }

  return (
    <>
      <Helmet>
        <title>{SHADOWING_ADMIN_CONTENT.pageTitle} | Tacho Admin</title>
      </Helmet>

      <section className="space-y-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-2xl font-semibold" style={{ color: 'var(--on-surface)' }}>
              {SHADOWING_ADMIN_CONTENT.heading}
            </h1>
            <p className="text-sm" style={{ color: 'var(--on-surface-variant)' }}>
              {SHADOWING_ADMIN_CONTENT.description}
            </p>
          </div>
          <Button type="button" size="sm" onClick={state.handleOpenCreate}>
            <PlusIcon size={16} />
            {SHADOWING_ADMIN_CONTENT.createLabel}
          </Button>
        </div>

        <ShadowingTopicFormDialog
          mode="create"
          open={state.isCreateDialogOpen}
          onOpenChange={(open) => {
            if (!open) state.handleCloseCreate()
          }}
          isPending={createTopicMutation.isPending}
          onUploadCoverImage={handleUploadCoverImage}
          onSubmit={handleCreateTopic}
        />

        <ShadowingAdminFilters
          keywordInput={state.keywordInput}
          levelInput={state.levelInput}
          statusInput={state.statusInput}
          visibilityInput={state.visibilityInput}
          isOfficialInput={state.isOfficialInput}
          totalItems={state.totalItems}
          onKeywordInputChange={state.setKeywordInput}
          onLevelChange={state.setLevelInput}
          onStatusChange={state.setStatusInput}
          onVisibilityChange={state.setVisibilityInput}
          onIsOfficialChange={(value) => state.setIsOfficialInput(value ? true : undefined)}
          onSearch={state.handleSearch}
          onReset={state.handleReset}
        />

        <ShadowingAdminTable
          items={state.items}
          isLoading={state.isLoading}
          isFetching={state.isFetching}
          currentPage={state.currentPage}
          totalPage={state.totalPage}
          onPageChange={state.handlePageChange}
          onCreate={state.handleOpenCreate}
          onOpenDetail={(item) => state.navigate(`/admin/shadowing/${item.id}`)}
          onDelete={(item) => setPendingDeleteTopicId(item.id)}
        />

        <ShadowingConfirmDialog
          open={Boolean(pendingDeleteTopicId)}
          title={SHADOWING_ADMIN_CONTENT.deleteTopicConfirmTitle}
          description={SHADOWING_ADMIN_CONTENT.deleteTopicConfirmMessage}
          isPending={deleteTopicMutation.isPending}
          onOpenChange={(open) => {
            if (!open) setPendingDeleteTopicId(null)
          }}
          onConfirm={() => {
            if (!pendingDeleteTopicId) return
            void state.handleDelete(pendingDeleteTopicId).finally(() => setPendingDeleteTopicId(null))
          }}
        />
      </section>
    </>
  )
}
