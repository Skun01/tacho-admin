import { useState } from 'react'
import { Helmet } from '@dr.pogodin/react-helmet'
import { PencilSimpleIcon, PlusIcon, TrashIcon, QuestionIcon } from '@phosphor-icons/react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Skeleton } from '@/components/ui/skeleton'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { gooeyToast } from '@/components/ui/goey-toaster'
import { ConversationScenarioFormDialog } from '@/components/conversation/ConversationScenarioFormDialog'
import { ConversationScenarioDeleteDialog } from '@/components/conversation/ConversationScenarioDeleteDialog'
import { CONVERSATION_SCENARIO_CONTENT } from '@/constants/conversationScenario'
import { getScenarioIcon } from '@/constants/scenarioIcons'
import { useConversationScenarioList } from '@/hooks/useConversationScenarioQueries'
import { useConversationScenarioMutations } from '@/hooks/useConversationScenarioMutations'
import type { ConversationScenarioResponse } from '@/types/conversationScenario'
import type { ConversationScenarioFormValues } from '@/lib/validations/conversationScenario'

export default function AdminConversationScenariosPage() {
  const { data: scenarios, isLoading } = useConversationScenarioList()
  const { createMutation, updateMutation, deleteMutation, getApiErrorMessage } = useConversationScenarioMutations()

  const [formDialog, setFormDialog] = useState<
    { open: false } | { open: true; mode: 'create' } | { open: true; mode: 'edit'; scenario: ConversationScenarioResponse }
  >({ open: false })

  const [deleteDialog, setDeleteDialog] = useState<
    { open: false } | { open: true; scenario: ConversationScenarioResponse }
  >({ open: false })

  const content = CONVERSATION_SCENARIO_CONTENT

  async function handleCreate(values: ConversationScenarioFormValues) {
    try {
      await createMutation.mutateAsync(values)
      gooeyToast.success(content.toast.createSuccess)
      setFormDialog({ open: false })
    } catch (error) {
      gooeyToast.error(getApiErrorMessage(error, content.toast.createError))
    }
  }

  async function handleUpdate(values: ConversationScenarioFormValues) {
    if (!formDialog.open || formDialog.mode !== 'edit') return
    try {
      await updateMutation.mutateAsync({ id: formDialog.scenario.id, payload: values })
      gooeyToast.success(content.toast.updateSuccess)
      setFormDialog({ open: false })
    } catch (error) {
      gooeyToast.error(getApiErrorMessage(error, content.toast.updateError))
    }
  }

  async function handleDelete() {
    if (!deleteDialog.open) return
    try {
      await deleteMutation.mutateAsync(deleteDialog.scenario.id)
      gooeyToast.success(content.toast.deleteSuccess)
      setDeleteDialog({ open: false })
    } catch (error) {
      gooeyToast.error(getApiErrorMessage(error, content.toast.deleteError))
    }
  }

  return (
    <>
      <Helmet>
        <title>{content.pageTitle}</title>
      </Helmet>

      <section className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold tracking-tight">{content.heading}</h1>
            <p className="text-muted-foreground">{content.description}</p>
          </div>
          <Button onClick={() => setFormDialog({ open: true, mode: 'create' })}>
            <PlusIcon size={20} />
            {content.actions.create}
          </Button>
        </div>

        {isLoading ? (
          <div className="space-y-3">
            {Array.from({ length: 4 }).map((_, i) => (
              <Skeleton key={i} className="h-14 w-full" />
            ))}
          </div>
        ) : !scenarios?.length ? (
          <div className="flex flex-col items-center justify-center rounded-lg border border-dashed py-16">
            <p className="text-lg font-medium text-muted-foreground">{content.empty.title}</p>
            <p className="text-sm text-muted-foreground">{content.empty.description}</p>
          </div>
        ) : (
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-16">{content.columns.icon}</TableHead>
                  <TableHead>{content.columns.name}</TableHead>
                  <TableHead className="hidden md:table-cell">{content.columns.description}</TableHead>
                  <TableHead className="w-24 text-center">{content.columns.sortOrder}</TableHead>
                  <TableHead className="w-32 text-center">{content.columns.status}</TableHead>
                  <TableHead className="w-28 text-right">{content.columns.actions}</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {scenarios.map((scenario) => (
                  <TableRow key={scenario.id}>
                    <TableCell className="text-2xl">
                      {(() => {
                        const IconComponent = getScenarioIcon(scenario.icon)
                        return IconComponent ? <IconComponent size={24} /> : <QuestionIcon size={24} />
                      })()}
                    </TableCell>
                    <TableCell className="font-medium">{scenario.name}</TableCell>
                    <TableCell className="hidden max-w-xs truncate text-muted-foreground md:table-cell">
                      {scenario.description}
                    </TableCell>
                    <TableCell className="text-center">{scenario.sortOrder}</TableCell>
                    <TableCell className="text-center">
                      <Badge variant={scenario.isActive ? 'default' : 'secondary'}>
                        {scenario.isActive ? content.status.active : content.status.inactive}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end gap-1">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => setFormDialog({ open: true, mode: 'edit', scenario })}
                        >
                          <PencilSimpleIcon size={18} />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => setDeleteDialog({ open: true, scenario })}
                        >
                          <TrashIcon size={18} />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
      </section>

      {formDialog.open && formDialog.mode === 'create' && (
        <ConversationScenarioFormDialog
          open
          onOpenChange={(open) => !open && setFormDialog({ open: false })}
          mode="create"
          onSubmit={handleCreate}
          isPending={createMutation.isPending}
        />
      )}

      {formDialog.open && formDialog.mode === 'edit' && (
        <ConversationScenarioFormDialog
          open
          onOpenChange={(open) => !open && setFormDialog({ open: false })}
          mode="edit"
          scenario={formDialog.scenario}
          onSubmit={handleUpdate}
          isPending={updateMutation.isPending}
        />
      )}

      <ConversationScenarioDeleteDialog
        open={deleteDialog.open}
        onOpenChange={(open) => !open && setDeleteDialog({ open: false })}
        scenarioName={deleteDialog.open ? deleteDialog.scenario.name : ''}
        onConfirm={handleDelete}
        isPending={deleteMutation.isPending}
      />
    </>
  )
}
