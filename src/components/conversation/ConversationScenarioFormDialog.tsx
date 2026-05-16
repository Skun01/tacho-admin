import { zodResolver } from '@hookform/resolvers/zod'
import { SpinnerGapIcon } from '@phosphor-icons/react'
import { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Switch } from '@/components/ui/switch'
import { Textarea } from '@/components/ui/textarea'
import { CONVERSATION_SCENARIO_CONTENT } from '@/constants/conversationScenario'
import { SCENARIO_ICON_OPTIONS, getScenarioIcon } from '@/constants/scenarioIcons'
import {
  conversationScenarioSchema,
  type ConversationScenarioFormValues,
} from '@/lib/validations/conversationScenario'
import type { ConversationScenarioResponse } from '@/types/conversationScenario'
import { cn } from '@/lib/utils'

interface BaseDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  isPending: boolean
}

interface CreateDialogProps extends BaseDialogProps {
  mode: 'create'
  onSubmit: (values: ConversationScenarioFormValues) => Promise<void>
}

interface EditDialogProps extends BaseDialogProps {
  mode: 'edit'
  scenario: ConversationScenarioResponse
  onSubmit: (values: ConversationScenarioFormValues) => Promise<void>
}

type ConversationScenarioFormDialogProps = CreateDialogProps | EditDialogProps

function buildCreateDefaults(): ConversationScenarioFormValues {
  return {
    name: '',
    icon: '',
    description: '',
    sortOrder: 0,
    isActive: true,
  }
}

function buildEditDefaults(scenario: ConversationScenarioResponse): ConversationScenarioFormValues {
  return {
    name: scenario.name,
    icon: scenario.icon,
    description: scenario.description,
    sortOrder: scenario.sortOrder,
    isActive: scenario.isActive,
  }
}

export function ConversationScenarioFormDialog(props: ConversationScenarioFormDialogProps) {
  const isCreateMode = props.mode === 'create'
  const content = CONVERSATION_SCENARIO_CONTENT.form

  const form = useForm<ConversationScenarioFormValues>({
    resolver: zodResolver(conversationScenarioSchema),
    defaultValues: isCreateMode ? buildCreateDefaults() : buildEditDefaults(props.scenario),
  })

  useEffect(() => {
    if (isCreateMode) {
      form.reset(buildCreateDefaults())
      return
    }
    form.reset(buildEditDefaults(props.scenario))
  }, [form, isCreateMode, props])

  const isSubmitting = props.isPending || form.formState.isSubmitting

  async function handleSubmit(values: ConversationScenarioFormValues) {
    await props.onSubmit(values)
    if (isCreateMode) {
      form.reset(buildCreateDefaults())
    }
  }

  return (
    <Dialog open={props.open} onOpenChange={props.onOpenChange}>
      <DialogContent className="flex max-h-[85vh] flex-col overflow-hidden sm:max-w-lg">
        <DialogHeader className="shrink-0">
          <DialogTitle>
            {isCreateMode ? content.createTitle : content.editTitle}
          </DialogTitle>
          <DialogDescription>
            {isCreateMode ? content.createDescription : content.editDescription}
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form className="flex min-h-0 flex-1 flex-col overflow-hidden" onSubmit={form.handleSubmit(handleSubmit)}>
            <div className="min-h-0 flex-1 overflow-y-auto pr-2">
              <div className="space-y-4 pb-2">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem className="gap-1.5">
                      <FormLabel>{content.nameLabel}</FormLabel>
                      <FormControl>
                        <Input {...field} placeholder={content.namePlaceholder} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="icon"
                  render={({ field }) => (
                    <FormItem className="gap-1.5">
                      <FormLabel>{content.iconLabel}</FormLabel>
                      <div className="grid grid-cols-8 gap-2">
                        {SCENARIO_ICON_OPTIONS.map((option) => {
                          const IconComponent = option.icon
                          return (
                            <button
                              key={option.name}
                              type="button"
                              className={cn(
                                'flex h-9 w-9 items-center justify-center rounded-md border transition-colors hover:bg-accent',
                                field.value === option.name && 'border-primary bg-primary/10 text-primary',
                              )}
                              onClick={() => field.onChange(option.name)}
                            >
                              <IconComponent size={20} />
                            </button>
                          )
                        })}
                      </div>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="description"
                  render={({ field }) => (
                    <FormItem className="gap-1.5">
                      <FormLabel>{content.descriptionLabel}</FormLabel>
                      <FormControl>
                        <Textarea {...field} placeholder={content.descriptionPlaceholder} rows={3} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="sortOrder"
                  render={({ field }) => (
                    <FormItem className="gap-1.5">
                      <FormLabel>{content.sortOrderLabel}</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          min={0}
                          placeholder={content.sortOrderPlaceholder}
                          value={field.value}
                          onChange={(e) => field.onChange(Number(e.target.value))}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="isActive"
                  render={({ field }) => (
                    <FormItem className="flex items-center justify-between rounded-lg border p-4">
                      <div className="space-y-0.5">
                        <FormLabel className="text-base">{content.isActiveLabel}</FormLabel>
                        <FormDescription>{content.isActiveDescription}</FormDescription>
                      </div>
                      <FormControl>
                        <Switch checked={field.value} onCheckedChange={field.onChange} />
                      </FormControl>
                    </FormItem>
                  )}
                />
              </div>
            </div>

            <DialogFooter className="shrink-0 border-t pt-4">
              <Button type="button" variant="outline" onClick={() => props.onOpenChange(false)}>
                {content.cancelLabel}
              </Button>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting && <SpinnerGapIcon size={16} className="animate-spin" />}
                {isCreateMode ? content.createConfirmLabel : content.saveLabel}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}
