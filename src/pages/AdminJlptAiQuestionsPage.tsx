import { SparkleIcon } from '@phosphor-icons/react'
import { useState } from 'react'
import { Helmet } from '@dr.pogodin/react-helmet'
import { JlptAiGenerateDialog } from '@/components/jlpt/JlptAiGenerateDialog'
import { JlptAiQuestionAdminFilters } from '@/components/jlpt/JlptAiQuestionAdminFilters'
import { JlptAiQuestionAdminTable } from '@/components/jlpt/JlptAiQuestionAdminTable'
import { JlptAiQuestionDetailDialog } from '@/components/jlpt/JlptAiQuestionDetailDialog'
import { Button } from '@/components/ui/button'
import { gooeyToast } from '@/components/ui/goey-toaster'
import { JLPT_AI_QUESTION_CONTENT } from '@/constants/jlptAdmin'
import { useAdminJlptAiQuestionsPageState } from '@/hooks/useAdminJlptAiQuestionsPageState'
import { useJlptAdminMutations } from '@/hooks/useJlptAdminMutations'
import type { AiGenerateFormValues } from '@/lib/validations/jlptAdmin'
import type { AiGeneratedQuestionResponse } from '@/types/jlptAdmin'

export function AdminJlptAiQuestionsPage() {
  const state = useAdminJlptAiQuestionsPageState()
  const [selectedItem, setSelectedItem] = useState<AiGeneratedQuestionResponse | null>(null)

  const {
    generateAiQuestionsMutation,
    updateAiQuestionMutation,
    approveAiQuestionMutation,
    rejectAiQuestionMutation,
    getApiErrorMessage,
  } = useJlptAdminMutations()

  async function handleGenerate(values: AiGenerateFormValues) {
    try {
      await generateAiQuestionsMutation.mutateAsync({
        level: values.level,
        sectionType: values.sectionType,
        topic: values.topic,
        count: values.count,
      })
      gooeyToast.success(JLPT_AI_QUESTION_CONTENT.generateSuccess)
      state.handleCloseGenerate()
    } catch (error) {
      gooeyToast.error(getApiErrorMessage(error, JLPT_AI_QUESTION_CONTENT.generateFailedFallback))
    }
  }

  async function handleApprove() {
    if (!selectedItem) return
    try {
      await approveAiQuestionMutation.mutateAsync(selectedItem.id)
      gooeyToast.success(JLPT_AI_QUESTION_CONTENT.approvedSuccess)
      setSelectedItem(null)
    } catch (error) {
      gooeyToast.error(getApiErrorMessage(error, JLPT_AI_QUESTION_CONTENT.approveFailedFallback))
    }
  }

  async function handleReject() {
    if (!selectedItem) return
    try {
      await rejectAiQuestionMutation.mutateAsync(selectedItem.id)
      gooeyToast.success(JLPT_AI_QUESTION_CONTENT.rejectedSuccess)
      setSelectedItem(null)
    } catch (error) {
      gooeyToast.error(getApiErrorMessage(error, JLPT_AI_QUESTION_CONTENT.rejectFailedFallback))
    }
  }

  async function handleSaveEdit(generatedData: string) {
    if (!selectedItem) return
    try {
      await updateAiQuestionMutation.mutateAsync({
        id: selectedItem.id,
        payload: { generatedData },
      })
      gooeyToast.success(JLPT_AI_QUESTION_CONTENT.editedSuccess)
      setSelectedItem(null)
    } catch (error) {
      gooeyToast.error(getApiErrorMessage(error, JLPT_AI_QUESTION_CONTENT.editFailedFallback))
    }
  }

  return (
    <>
      <Helmet>
        <title>{JLPT_AI_QUESTION_CONTENT.pageTitle} | Tacho Admin</title>
      </Helmet>

      <section className="space-y-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-2xl font-semibold" style={{ color: 'var(--on-surface)' }}>
              {JLPT_AI_QUESTION_CONTENT.heading}
            </h1>
            <p className="text-sm" style={{ color: 'var(--on-surface-variant)' }}>
              {JLPT_AI_QUESTION_CONTENT.description}
            </p>
          </div>
          <Button type="button" size="sm" onClick={state.handleOpenGenerate}>
            <SparkleIcon size={16} />
            {JLPT_AI_QUESTION_CONTENT.generateLabel}
          </Button>
        </div>

        <JlptAiGenerateDialog
          open={state.isGenerateDialogOpen}
          onOpenChange={(open) => {
            if (!open) state.handleCloseGenerate()
          }}
          isPending={generateAiQuestionsMutation.isPending}
          onSubmit={handleGenerate}
        />

        <JlptAiQuestionAdminFilters
          levelInput={state.levelInput}
          sectionTypeInput={state.sectionTypeInput}
          statusInput={state.statusInput}
          totalItems={state.totalItems}
          onLevelChange={state.setLevelInput}
          onSectionTypeChange={state.setSectionTypeInput}
          onStatusChange={state.setStatusInput}
          onSearch={state.handleSearch}
          onReset={state.handleReset}
        />

        <JlptAiQuestionAdminTable
          items={state.items}
          isLoading={state.isLoading}
          isFetching={state.isFetching}
          currentPage={state.currentPage}
          totalPage={state.totalPage}
          onPageChange={state.handlePageChange}
          onGenerate={state.handleOpenGenerate}
          onViewDetail={(item) => setSelectedItem(item)}
        />

        {selectedItem && (
          <JlptAiQuestionDetailDialog
            open
            item={selectedItem}
            isApproving={approveAiQuestionMutation.isPending}
            isRejecting={rejectAiQuestionMutation.isPending}
            isEditing={updateAiQuestionMutation.isPending}
            onOpenChange={(open) => {
              if (!open) setSelectedItem(null)
            }}
            onApprove={handleApprove}
            onReject={handleReject}
            onSaveEdit={handleSaveEdit}
          />
        )}
      </section>
    </>
  )
}
