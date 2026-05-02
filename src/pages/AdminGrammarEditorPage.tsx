import { useCallback, useEffect, useRef, useState } from 'react'
import { useNavigate, useParams, useBlocker } from 'react-router'
import { Helmet } from 'react-helmet-async'
import { ArrowLeftIcon } from '@phosphor-icons/react'
import { gooeyToast } from '@/components/ui/goey-toaster'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { GrammarUpsertForm } from '@/components/grammar/GrammarUpsertForm'
import { ADMIN_GRAMMAR_CONTENT } from '@/constants/adminContent'
import { useGrammarAdminDetail } from '@/hooks/useGrammarAdminDetail'
import { useGrammarAdminMutations } from '@/hooks/useGrammarAdminMutations'
import type { GrammarAdminDetail, GrammarUpsertPayload } from '@/types/grammarAdmin'

export default function AdminGrammarEditorPage() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const mode = id ? 'edit' : 'create'

  const { fetchDetail, isLoadingDetail } = useGrammarAdminDetail()
  const { createMutation, updateMutation, getApiErrorMessage } = useGrammarAdminMutations()

  const [initialData, setInitialData] = useState<GrammarAdminDetail | null>(null)
  const [isDirty, setIsDirty] = useState(false)
  const allowNavigationRef = useRef(false)

  // React Router blocker for unsaved changes
  const blocker = useBlocker(
    useCallback(
      ({ currentLocation, nextLocation }: { currentLocation: { pathname: string }; nextLocation: { pathname: string } }) =>
        !allowNavigationRef.current &&
        isDirty && currentLocation.pathname !== nextLocation.pathname,
      [isDirty],
    ),
  )

  // Browser beforeunload
  useEffect(() => {
    const handler = (event: BeforeUnloadEvent) => {
      if (isDirty) {
        event.preventDefault()
      }
    }
    window.addEventListener('beforeunload', handler)
    return () => window.removeEventListener('beforeunload', handler)
  }, [isDirty])

  // Load detail for edit mode
  useEffect(() => {
    if (!id) return
    let isActive = true

    fetchDetail(id)
      .then((data) => {
        if (isActive) setInitialData(data)
      })
      .catch((error) => {
        if (isActive) {
          gooeyToast.error(getApiErrorMessage(error, ADMIN_GRAMMAR_CONTENT.editor.notFoundLabel))
        }
      })
    return () => {
      isActive = false
    }
  }, [id, fetchDetail, getApiErrorMessage])

  const handleSubmit = async (payload: GrammarUpsertPayload) => {
    try {
      if (mode === 'create') {
        await createMutation.mutateAsync(payload)
        gooeyToast.success(ADMIN_GRAMMAR_CONTENT.toast.createSuccess)
      } else {
        await updateMutation.mutateAsync({ id: id!, payload })
        gooeyToast.success(ADMIN_GRAMMAR_CONTENT.toast.updateSuccess)
      }

      allowNavigationRef.current = true
      setIsDirty(false)

      if (blocker.state === 'blocked') {
        blocker.proceed?.()
        return
      }
      navigate('/admin/grammar')
    } catch (error) {
      allowNavigationRef.current = false
      gooeyToast.error(getApiErrorMessage(error, ADMIN_GRAMMAR_CONTENT.toast.crudErrorFallback))
    }
  }

  const isSubmitting = createMutation.isPending || updateMutation.isPending

  return (
    <>
      <Helmet>
        <title>
          {mode === 'create'
            ? ADMIN_GRAMMAR_CONTENT.editor.createPageTitle
            : ADMIN_GRAMMAR_CONTENT.editor.editPageTitle} | Tacho Admin
        </title>
      </Helmet>

      <div className="space-y-6">
        {/* Back button */}
        <Button
          type="button"
          variant="ghost"
          className="gap-1.5"
          onClick={() => navigate('/admin/grammar')}
        >
          <ArrowLeftIcon size={16} />
          {ADMIN_GRAMMAR_CONTENT.backToListLabel}
        </Button>

        {/* Header */}
        <div>
          <h1 className="text-2xl font-semibold" style={{ color: 'var(--on-surface)' }}>
            {mode === 'create'
              ? ADMIN_GRAMMAR_CONTENT.editor.createPageTitle
              : ADMIN_GRAMMAR_CONTENT.editor.editPageTitle}
          </h1>
          <p className="text-sm" style={{ color: 'var(--on-surface-variant)' }}>
            {mode === 'create'
              ? ADMIN_GRAMMAR_CONTENT.editor.createDescription
              : ADMIN_GRAMMAR_CONTENT.editor.editDescription}
          </p>
        </div>

        {/* Form */}
        <GrammarUpsertForm
          open={true}
          onOpenChange={(open) => {
            if (!open) navigate('/admin/grammar')
          }}
          mode={mode}
          initialData={initialData}
          isSubmitting={isSubmitting}
          isLoadingDetail={isLoadingDetail}
          onSubmit={handleSubmit}
          onDirtyChange={setIsDirty}
        />
      </div>

      {/* Unsaved changes dialog */}
      <Dialog open={blocker.state === 'blocked'} onOpenChange={() => {}}>
        <DialogContent className="sm:max-w-[400px]">
          <DialogHeader>
            <DialogTitle>{ADMIN_GRAMMAR_CONTENT.editor.confirmLeaveTitle}</DialogTitle>
            <DialogDescription>{ADMIN_GRAMMAR_CONTENT.editor.confirmLeaveDescription}</DialogDescription>
          </DialogHeader>
          <div className="flex justify-end gap-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => {
                allowNavigationRef.current = true
                blocker.proceed?.()
              }}
            >
              {ADMIN_GRAMMAR_CONTENT.editor.confirmLeaveDiscardLabel}
            </Button>
            <Button
              type="button"
              onClick={() => {
                allowNavigationRef.current = false
                blocker.reset?.()
              }}
            >
              {ADMIN_GRAMMAR_CONTENT.editor.confirmLeaveStayLabel}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  )
}
