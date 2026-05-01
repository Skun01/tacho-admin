import {
  ArrowLeftIcon,
  CaretDownIcon,
  PencilSimpleIcon,
  PlusIcon,
  SpeakerHighIcon,
  TrashIcon,
} from '@phosphor-icons/react'
import { useState } from 'react'
import { Helmet } from 'react-helmet-async'
import { useNavigate, useParams } from 'react-router'
import { JlptConfirmDialog } from '@/components/jlpt/JlptConfirmDialog'
import { JlptExamFormDialog } from '@/components/jlpt/JlptExamFormDialog'
import { JlptQuestionFormDialog } from '@/components/jlpt/JlptQuestionFormDialog'
import { JlptQuestionGroupFormDialog } from '@/components/jlpt/JlptQuestionGroupFormDialog'
import { JlptSectionFormDialog } from '@/components/jlpt/JlptSectionFormDialog'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible'
import { gooeyToast } from '@/components/ui/goey-toaster'
import { Skeleton } from '@/components/ui/skeleton'
import {
  JLPT_EXAM_CONTENT,
  JLPT_LEVEL_LABELS,
  OPTION_LABEL_LABELS,
  PUBLISH_STATUS_LABELS,
  SECTION_TYPE_LABELS,
} from '@/constants/jlptAdmin'
import { useJlptAdminMutations } from '@/hooks/useJlptAdminMutations'
import { useJlptExamDetail } from '@/hooks/useJlptAdminQueries'
import type {
  ChoukaiMondaiType,
  ExamSectionResponse,
  JlptLevel,
  OptionLabel,
  QuestionGroupQuestionResponse,
  QuestionGroupResponse,
  SectionType,
} from '@/types/jlptAdmin'
import type { QuestionFormValues } from '@/lib/validations/jlptAdmin'

type DialogTarget =
  | { type: 'editExam' }
  | { type: 'createSection' }
  | { type: 'editSection'; section: ExamSectionResponse }
  | { type: 'deleteSection'; sectionId: string }
  | { type: 'createGroup'; sectionId: string }
  | { type: 'editGroup'; sectionId: string; group: QuestionGroupResponse }
  | { type: 'deleteGroup'; sectionId: string; groupId: string }
  | { type: 'createQuestion'; groupId: string }
  | { type: 'editQuestion'; groupId: string; question: QuestionGroupQuestionResponse }
  | { type: 'deleteQuestion'; questionId: string }
  | { type: 'publish' }

export function AdminJlptExamDetailPage() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const { data: exam, isLoading } = useJlptExamDetail(id ?? '')
  const [dialog, setDialog] = useState<DialogTarget | null>(null)

  const {
    updateExamMutation,
    publishExamMutation,
    createSectionMutation,
    updateSectionMutation,
    deleteSectionMutation,
    createGroupMutation,
    updateGroupMutation,
    deleteGroupMutation,
    generateGroupAudioMutation,
    createQuestionMutation,
    updateQuestionMutation,
    deleteQuestionMutation,
    getApiErrorMessage,
  } = useJlptAdminMutations()

  if (isLoading || !exam) {
    return (
      <section className="space-y-6">
        <Skeleton className="h-8 w-48" />
        <Skeleton className="h-48 w-full" />
        <Skeleton className="h-64 w-full" />
      </section>
    )
  }

  const examId = exam.id
  const closeDialog = () => setDialog(null)

  // ── Exam handlers ────────────────────────────────────────────────────────

  async function handleUpdateExam(payload: { title: string; level: JlptLevel; totalDurationMinutes: number }) {
    try {
      await updateExamMutation.mutateAsync({ id: examId, payload })
      gooeyToast.success(JLPT_EXAM_CONTENT.examUpdatedSuccess)
      closeDialog()
    } catch (error) {
      gooeyToast.error(getApiErrorMessage(error, JLPT_EXAM_CONTENT.updateExamFailedFallback))
    }
  }

  async function handlePublish() {
    try {
      await publishExamMutation.mutateAsync(examId)
      gooeyToast.success(JLPT_EXAM_CONTENT.examPublishedSuccess)
      closeDialog()
    } catch (error) {
      gooeyToast.error(getApiErrorMessage(error, JLPT_EXAM_CONTENT.publishExamFailedFallback))
    }
  }

  // ── Section handlers ─────────────────────────────────────────────────────

  async function handleCreateSection(payload: { sectionType: SectionType; orderIndex: number; durationMinutes: number; maxScore: number; passScore: number }) {
    try {
      await createSectionMutation.mutateAsync({ examId: examId, payload })
      gooeyToast.success(JLPT_EXAM_CONTENT.sectionCreatedSuccess)
      closeDialog()
    } catch (error) {
      gooeyToast.error(getApiErrorMessage(error, JLPT_EXAM_CONTENT.createSectionFailedFallback))
    }
  }

  async function handleUpdateSection(sectionId: string, payload: { sectionType: SectionType; orderIndex: number; durationMinutes: number; maxScore: number; passScore: number }) {
    try {
      await updateSectionMutation.mutateAsync({ examId: examId, sectionId, payload })
      gooeyToast.success(JLPT_EXAM_CONTENT.sectionUpdatedSuccess)
      closeDialog()
    } catch (error) {
      gooeyToast.error(getApiErrorMessage(error, JLPT_EXAM_CONTENT.updateSectionFailedFallback))
    }
  }

  async function handleDeleteSection(sectionId: string) {
    try {
      await deleteSectionMutation.mutateAsync({ examId: examId, sectionId })
      gooeyToast.success(JLPT_EXAM_CONTENT.sectionDeletedSuccess)
      closeDialog()
    } catch (error) {
      gooeyToast.error(getApiErrorMessage(error, JLPT_EXAM_CONTENT.deleteSectionFailedFallback))
    }
  }

  // ── Group handlers ───────────────────────────────────────────────────────

  async function handleCreateGroup(sectionId: string, payload: { instruction: string; passageText?: string | null; audioScript?: string | null; orderIndex: number; mondaiType?: ChoukaiMondaiType | null }) {
    try {
      await createGroupMutation.mutateAsync({ examId: examId, sectionId, payload })
      gooeyToast.success(JLPT_EXAM_CONTENT.groupCreatedSuccess)
      closeDialog()
    } catch (error) {
      gooeyToast.error(getApiErrorMessage(error, JLPT_EXAM_CONTENT.createGroupFailedFallback))
    }
  }

  async function handleUpdateGroup(sectionId: string, groupId: string, payload: { instruction: string; passageText?: string | null; audioScript?: string | null; orderIndex: number; mondaiType?: ChoukaiMondaiType | null }) {
    try {
      await updateGroupMutation.mutateAsync({ examId: examId, sectionId, groupId, payload })
      gooeyToast.success(JLPT_EXAM_CONTENT.groupUpdatedSuccess)
      closeDialog()
    } catch (error) {
      gooeyToast.error(getApiErrorMessage(error, JLPT_EXAM_CONTENT.updateGroupFailedFallback))
    }
  }

  async function handleDeleteGroup(sectionId: string, groupId: string) {
    try {
      await deleteGroupMutation.mutateAsync({ examId: examId, sectionId, groupId })
      gooeyToast.success(JLPT_EXAM_CONTENT.groupDeletedSuccess)
      closeDialog()
    } catch (error) {
      gooeyToast.error(getApiErrorMessage(error, JLPT_EXAM_CONTENT.deleteGroupFailedFallback))
    }
  }

  async function handleGenerateAudio(groupId: string) {
    try {
      await generateGroupAudioMutation.mutateAsync({ examId: examId, groupId })
      gooeyToast.success(JLPT_EXAM_CONTENT.generateAudioSuccess)
    } catch (error) {
      gooeyToast.error(getApiErrorMessage(error, JLPT_EXAM_CONTENT.generateAudioFailedFallback))
    }
  }

  // ── Question handlers ────────────────────────────────────────────────────

  async function handleCreateQuestion(groupId: string, values: QuestionFormValues) {
    try {
      await createQuestionMutation.mutateAsync({
        examId: examId,
        payload: { groupId, ...values, explanation: values.explanation || null },
      })
      gooeyToast.success(JLPT_EXAM_CONTENT.questionCreatedSuccess)
      closeDialog()
    } catch (error) {
      gooeyToast.error(getApiErrorMessage(error, JLPT_EXAM_CONTENT.createQuestionFailedFallback))
    }
  }

  async function handleUpdateQuestion(questionId: string, values: QuestionFormValues) {
    try {
      await updateQuestionMutation.mutateAsync({
        examId: examId,
        id: questionId,
        payload: { ...values, explanation: values.explanation || null },
      })
      gooeyToast.success(JLPT_EXAM_CONTENT.questionUpdatedSuccess)
      closeDialog()
    } catch (error) {
      gooeyToast.error(getApiErrorMessage(error, JLPT_EXAM_CONTENT.updateQuestionFailedFallback))
    }
  }

  async function handleDeleteQuestion(questionId: string) {
    try {
      await deleteQuestionMutation.mutateAsync({ examId: examId, id: questionId })
      gooeyToast.success(JLPT_EXAM_CONTENT.questionDeletedSuccess)
      closeDialog()
    } catch (error) {
      gooeyToast.error(getApiErrorMessage(error, JLPT_EXAM_CONTENT.deleteQuestionFailedFallback))
    }
  }

  const isPublished = exam.status === 'Published'
  const sections = [...exam.sections].sort((a, b) => a.orderIndex - b.orderIndex)

  return (
    <>
      <Helmet>
        <title>{exam.title} | {JLPT_EXAM_CONTENT.detailPageTitle}</title>
      </Helmet>

      <section className="space-y-6">
        {/* Header */}
        <div className="flex items-center gap-3">
          <Button type="button" variant="ghost" size="icon" onClick={() => navigate('/admin/jlpt/exams')}>
            <ArrowLeftIcon size={20} />
          </Button>
          <div className="flex-1">
            <h1 className="text-2xl font-semibold" style={{ color: 'var(--on-surface)' }}>{exam.title}</h1>
            <div className="mt-1 flex items-center gap-2 text-sm" style={{ color: 'var(--on-surface-variant)' }}>
              <Badge variant="outline">{JLPT_LEVEL_LABELS[exam.level]}</Badge>
              <Badge variant={isPublished ? 'default' : 'secondary'}>{PUBLISH_STATUS_LABELS[exam.status]}</Badge>
              <span>{exam.totalDurationMinutes} {JLPT_EXAM_CONTENT.columns.duration.toLowerCase()}</span>
            </div>
          </div>
          <div className="flex gap-2">
            {!isPublished && (
              <>
                <Button type="button" variant="outline" size="sm" onClick={() => setDialog({ type: 'editExam' })}>
                  <PencilSimpleIcon size={16} />
                  {JLPT_EXAM_CONTENT.actions.edit}
                </Button>
                <Button type="button" size="sm" onClick={() => setDialog({ type: 'publish' })}>
                  {JLPT_EXAM_CONTENT.actions.publish}
                </Button>
              </>
            )}
          </div>
        </div>

        {/* Sections */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>{JLPT_EXAM_CONTENT.sectionsHeading}</CardTitle>
            {!isPublished && (
              <Button type="button" variant="outline" size="sm" onClick={() => setDialog({ type: 'createSection' })}>
                <PlusIcon size={16} />
                {JLPT_EXAM_CONTENT.addSectionLabel}
              </Button>
            )}
          </CardHeader>
          <CardContent className="space-y-4">
            {sections.length === 0 && (
              <p className="py-6 text-center text-sm" style={{ color: 'var(--on-surface-variant)' }}>
                {JLPT_EXAM_CONTENT.noSections}
              </p>
            )}
            {sections.map((section) => (
              <SectionCard
                key={section.id}
                section={section}
                isPublished={isPublished}
                onEdit={() => setDialog({ type: 'editSection', section })}
                onDelete={() => setDialog({ type: 'deleteSection', sectionId: section.id })}
                onCreateGroup={() => setDialog({ type: 'createGroup', sectionId: section.id })}
                onEditGroup={(group) => setDialog({ type: 'editGroup', sectionId: section.id, group })}
                onDeleteGroup={(groupId) => setDialog({ type: 'deleteGroup', sectionId: section.id, groupId })}
                onGenerateAudio={handleGenerateAudio}
                isGeneratingAudio={generateGroupAudioMutation.isPending}
                onCreateQuestion={(groupId) => setDialog({ type: 'createQuestion', groupId })}
                onEditQuestion={(groupId, question) => setDialog({ type: 'editQuestion', groupId, question })}
                onDeleteQuestion={(questionId) => setDialog({ type: 'deleteQuestion', questionId })}
              />
            ))}
          </CardContent>
        </Card>
      </section>

      {/* ── Dialogs ─────────────────────────────────────────────────────────── */}

      {dialog?.type === 'editExam' && (
        <JlptExamFormDialog
          mode="edit"
          exam={exam}
          open
          onOpenChange={(o) => { if (!o) closeDialog() }}
          isPending={updateExamMutation.isPending}
          onSubmit={handleUpdateExam}
        />
      )}

      {dialog?.type === 'publish' && (
        <JlptConfirmDialog
          open
          title={JLPT_EXAM_CONTENT.actions.publish}
          description={JLPT_EXAM_CONTENT.examPublishedSuccess}
          confirmLabel={JLPT_EXAM_CONTENT.actions.publish}
          variant="default"
          isPending={publishExamMutation.isPending}
          onOpenChange={(o) => { if (!o) closeDialog() }}
          onConfirm={handlePublish}
        />
      )}

      {dialog?.type === 'createSection' && (
        <JlptSectionFormDialog
          mode="create"
          open
          onOpenChange={(o) => { if (!o) closeDialog() }}
          isPending={createSectionMutation.isPending}
          nextOrderIndex={sections.length}
          onSubmit={handleCreateSection}
        />
      )}

      {dialog?.type === 'editSection' && (
        <JlptSectionFormDialog
          mode="edit"
          open
          onOpenChange={(o) => { if (!o) closeDialog() }}
          isPending={updateSectionMutation.isPending}
          section={dialog.section}
          onSubmit={(payload) => handleUpdateSection(dialog.section.id, payload)}
        />
      )}

      {dialog?.type === 'deleteSection' && (
        <JlptConfirmDialog
          open
          title={JLPT_EXAM_CONTENT.deleteSectionConfirmTitle}
          description={JLPT_EXAM_CONTENT.deleteSectionConfirmMessage}
          isPending={deleteSectionMutation.isPending}
          onOpenChange={(o) => { if (!o) closeDialog() }}
          onConfirm={() => handleDeleteSection(dialog.sectionId)}
        />
      )}

      {dialog?.type === 'createGroup' && (
        <JlptQuestionGroupFormDialog
          mode="create"
          open
          onOpenChange={(o) => { if (!o) closeDialog() }}
          isPending={createGroupMutation.isPending}
          nextOrderIndex={0}
          onSubmit={(payload) => handleCreateGroup(dialog.sectionId, payload)}
        />
      )}

      {dialog?.type === 'editGroup' && (
        <JlptQuestionGroupFormDialog
          mode="edit"
          open
          onOpenChange={(o) => { if (!o) closeDialog() }}
          isPending={updateGroupMutation.isPending}
          group={dialog.group}
          onSubmit={(payload) => handleUpdateGroup(dialog.sectionId, dialog.group.id, payload)}
        />
      )}

      {dialog?.type === 'deleteGroup' && (
        <JlptConfirmDialog
          open
          title={JLPT_EXAM_CONTENT.deleteGroupConfirmTitle}
          description={JLPT_EXAM_CONTENT.deleteGroupConfirmMessage}
          isPending={deleteGroupMutation.isPending}
          onOpenChange={(o) => { if (!o) closeDialog() }}
          onConfirm={() => handleDeleteGroup(dialog.sectionId, dialog.groupId)}
        />
      )}

      {dialog?.type === 'createQuestion' && (
        <JlptQuestionFormDialog
          mode="create"
          open
          onOpenChange={(o) => { if (!o) closeDialog() }}
          isPending={createQuestionMutation.isPending}
          nextOrderIndex={0}
          onSubmit={(values) => handleCreateQuestion(dialog.groupId, values)}
        />
      )}

      {dialog?.type === 'editQuestion' && (
        <JlptQuestionFormDialog
          mode="edit"
          open
          onOpenChange={(o) => { if (!o) closeDialog() }}
          isPending={updateQuestionMutation.isPending}
          question={dialog.question}
          onSubmit={(values) => handleUpdateQuestion(dialog.question.id, values)}
        />
      )}

      {dialog?.type === 'deleteQuestion' && (
        <JlptConfirmDialog
          open
          title={JLPT_EXAM_CONTENT.deleteQuestionConfirmTitle}
          description={JLPT_EXAM_CONTENT.deleteQuestionConfirmMessage}
          isPending={deleteQuestionMutation.isPending}
          onOpenChange={(o) => { if (!o) closeDialog() }}
          onConfirm={() => handleDeleteQuestion(dialog.questionId)}
        />
      )}
    </>
  )
}

// ── Section Card ──────────────────────────────────────────────────────────────

interface SectionCardProps {
  section: ExamSectionResponse
  isPublished: boolean
  onEdit: () => void
  onDelete: () => void
  onCreateGroup: () => void
  onEditGroup: (group: QuestionGroupResponse) => void
  onDeleteGroup: (groupId: string) => void
  onGenerateAudio: (groupId: string) => void
  isGeneratingAudio: boolean
  onCreateQuestion: (groupId: string) => void
  onEditQuestion: (groupId: string, question: QuestionGroupQuestionResponse) => void
  onDeleteQuestion: (questionId: string) => void
}

function SectionCard({
  section,
  isPublished,
  onEdit,
  onDelete,
  onCreateGroup,
  onEditGroup,
  onDeleteGroup,
  onGenerateAudio,
  isGeneratingAudio,
  onCreateQuestion,
  onEditQuestion,
  onDeleteQuestion,
}: SectionCardProps) {
  const groups = [...section.questionGroups].sort((a, b) => a.orderIndex - b.orderIndex)

  return (
    <Collapsible defaultOpen className="rounded-lg border">
      <CollapsibleTrigger asChild>
        <div className="flex cursor-pointer items-center gap-3 px-4 py-3 hover:bg-muted/50">
          <CaretDownIcon size={16} className="shrink-0 transition-transform [[data-state=closed]_&]:rotate-[-90deg]" />
          <div className="flex-1">
            <div className="flex items-center gap-2">
              <span className="font-medium">{SECTION_TYPE_LABELS[section.sectionType]}</span>
              <Badge variant="outline" className="text-xs">{section.durationMinutes} min</Badge>
              <Badge variant="secondary" className="text-xs">
                {section.questionsCount} câu
              </Badge>
            </div>
            <div className="mt-0.5 text-xs" style={{ color: 'var(--on-surface-variant)' }}>
              Điểm: {section.passScore}/{section.maxScore} · Thứ tự: {section.orderIndex}
            </div>
          </div>
          {!isPublished && (
            <div className="flex gap-1" onClick={(e) => e.stopPropagation()}>
              <Button type="button" variant="ghost" size="icon" className="h-7 w-7" onClick={onEdit}>
                <PencilSimpleIcon size={14} />
              </Button>
              <Button type="button" variant="ghost" size="icon" className="h-7 w-7" onClick={onDelete}>
                <TrashIcon size={14} />
              </Button>
            </div>
          )}
        </div>
      </CollapsibleTrigger>
      <CollapsibleContent>
        <div className="space-y-3 border-t px-4 py-3">
          <div className="flex items-center justify-between">
            <h4 className="text-sm font-medium">{JLPT_EXAM_CONTENT.groupsHeading}</h4>
            {!isPublished && (
              <Button type="button" variant="outline" size="sm" onClick={onCreateGroup}>
                <PlusIcon size={14} />
                {JLPT_EXAM_CONTENT.addGroupLabel}
              </Button>
            )}
          </div>

          {groups.length === 0 && (
            <p className="py-4 text-center text-xs" style={{ color: 'var(--on-surface-variant)' }}>
              {JLPT_EXAM_CONTENT.noGroups}
            </p>
          )}

          {groups.map((group) => (
            <GroupCard
              key={group.id}
              group={group}
              sectionType={section.sectionType}
              isPublished={isPublished}
              onEdit={() => onEditGroup(group)}
              onDelete={() => onDeleteGroup(group.id)}
              onGenerateAudio={() => onGenerateAudio(group.id)}
              isGeneratingAudio={isGeneratingAudio}
              onCreateQuestion={() => onCreateQuestion(group.id)}
              onEditQuestion={(q) => onEditQuestion(group.id, q)}
              onDeleteQuestion={onDeleteQuestion}
            />
          ))}
        </div>
      </CollapsibleContent>
    </Collapsible>
  )
}

// ── Group Card ────────────────────────────────────────────────────────────────

interface GroupCardProps {
  group: QuestionGroupResponse
  sectionType: SectionType
  isPublished: boolean
  onEdit: () => void
  onDelete: () => void
  onGenerateAudio: () => void
  isGeneratingAudio: boolean
  onCreateQuestion: () => void
  onEditQuestion: (question: QuestionGroupQuestionResponse) => void
  onDeleteQuestion: (questionId: string) => void
}

function GroupCard({
  group,
  sectionType,
  isPublished,
  onEdit,
  onDelete,
  onGenerateAudio,
  isGeneratingAudio,
  onCreateQuestion,
  onEditQuestion,
  onDeleteQuestion,
}: GroupCardProps) {
  const questions = [...group.questions].sort((a, b) => a.orderIndex - b.orderIndex)
  const isChoukai = sectionType === 'Choukai'

  return (
    <div className="rounded-md border bg-muted/30 p-3">
      <div className="flex items-start justify-between gap-2">
        <div className="flex-1 text-sm">
          <p className="font-medium">{group.instruction}</p>
          {group.passageText && (
            <p className="mt-1 line-clamp-2 text-xs" style={{ color: 'var(--on-surface-variant)' }}>
              {group.passageText}
            </p>
          )}
        </div>
        <div className="flex shrink-0 gap-1">
          {isChoukai && !isPublished && (
            <Button
              type="button"
              variant="outline"
              size="sm"
              className="h-7 gap-1 text-xs"
              disabled={isGeneratingAudio}
              onClick={onGenerateAudio}
            >
              <SpeakerHighIcon size={14} />
              {JLPT_EXAM_CONTENT.generateAudioLabel}
            </Button>
          )}
          {!isPublished && (
            <>
              <Button type="button" variant="ghost" size="icon" className="h-7 w-7" onClick={onEdit}>
                <PencilSimpleIcon size={14} />
              </Button>
              <Button type="button" variant="ghost" size="icon" className="h-7 w-7" onClick={onDelete}>
                <TrashIcon size={14} />
              </Button>
            </>
          )}
        </div>
      </div>

      {group.audioUrl && (
        <div className="mt-2">
          <audio controls src={group.audioUrl} className="h-8 w-full" />
        </div>
      )}

      <div className="mt-3 space-y-2">
        <div className="flex items-center justify-between">
          <span className="text-xs font-medium">{JLPT_EXAM_CONTENT.questionsHeading} ({questions.length})</span>
          {!isPublished && (
            <Button type="button" variant="outline" size="sm" className="h-6 text-xs" onClick={onCreateQuestion}>
              <PlusIcon size={12} />
              {JLPT_EXAM_CONTENT.addQuestionLabel}
            </Button>
          )}
        </div>

        {questions.length === 0 && (
          <p className="py-2 text-center text-xs" style={{ color: 'var(--on-surface-variant)' }}>
            {JLPT_EXAM_CONTENT.noQuestions}
          </p>
        )}

        {questions.map((q, qi) => (
          <div key={q.id} className="flex items-start gap-2 rounded border bg-background px-3 py-2">
            <span className="shrink-0 text-xs font-semibold" style={{ color: 'var(--on-surface-variant)' }}>
              Q{qi + 1}
            </span>
            <div className="flex-1 text-xs">
              <p className="line-clamp-2">{q.questionText}</p>
              <div className="mt-1 flex flex-wrap gap-1">
                {q.options.map((opt) => (
                  <Badge
                    key={opt.id}
                    variant={opt.isCorrect ? 'default' : 'outline'}
                    className="text-[10px]"
                  >
                    {OPTION_LABEL_LABELS[opt.label as OptionLabel]}. {opt.text}
                  </Badge>
                ))}
              </div>
            </div>
            {!isPublished && (
              <div className="flex shrink-0 gap-0.5">
                <Button type="button" variant="ghost" size="icon" className="h-6 w-6" onClick={() => onEditQuestion(q)}>
                  <PencilSimpleIcon size={12} />
                </Button>
                <Button type="button" variant="ghost" size="icon" className="h-6 w-6" onClick={() => onDeleteQuestion(q.id)}>
                  <TrashIcon size={12} />
                </Button>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}
