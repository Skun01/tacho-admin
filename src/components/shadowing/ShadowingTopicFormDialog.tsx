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
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { ImageUpload } from '@/components/ui/image-upload'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Textarea } from '@/components/ui/textarea'
import {
  SHADOWING_ADMIN_CONTENT,
  SHADOWING_LEVEL_LABELS,
  SHADOWING_STATUS_LABELS,
  SHADOWING_VISIBILITY_LABELS,
} from '@/constants/shadowingAdmin'
import {
  createShadowingTopicSchema,
  editShadowingTopicSchema,
  type CreateShadowingTopicFormValues,
  type EditShadowingTopicFormValues,
} from '@/lib/validations/shadowingAdmin'
import { resolveApiMediaUrl } from '@/lib/mediaUrl'
import type {
  ShadowingLevel,
  ShadowingStatus,
  ShadowingTopicDetailResponse,
  ShadowingVisibility,
} from '@/types/shadowingAdmin'

interface BaseDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  isPending: boolean
  onUploadCoverImage: (file: File) => Promise<string>
}

interface CreateDialogProps extends BaseDialogProps {
  mode: 'create'
  onSubmit: (payload: {
    title: string
    description: string
    coverImageUrl?: string
    level?: ShadowingLevel
    visibility: ShadowingVisibility
    status: ShadowingStatus
  }) => Promise<void>
}

interface EditDialogProps extends BaseDialogProps {
  mode: 'edit'
  topic: ShadowingTopicDetailResponse
  onSubmit: (payload: {
    title: string
    description: string
    coverImageUrl?: string
    level?: ShadowingLevel
    visibility: ShadowingVisibility
    status: ShadowingStatus
  }) => Promise<void>
}

type ShadowingTopicFormDialogProps = CreateDialogProps | EditDialogProps

function buildCreateDefaults(): CreateShadowingTopicFormValues {
  return {
    title: '',
    description: '',
    coverImageFile: null,
    level: undefined,
    visibility: 'Public',
    status: 'Draft',
  }
}

function buildEditDefaults(topic: ShadowingTopicDetailResponse): EditShadowingTopicFormValues {
  return {
    title: topic.title,
    description: topic.description,
    coverImageFile: null,
    level: topic.level ?? undefined,
    visibility: topic.visibility,
    status: topic.status,
  }
}

export function ShadowingTopicFormDialog(props: ShadowingTopicFormDialogProps) {
  const isCreateMode = props.mode === 'create'

  const form = useForm<CreateShadowingTopicFormValues | EditShadowingTopicFormValues>({
    resolver: zodResolver(isCreateMode ? createShadowingTopicSchema : editShadowingTopicSchema),
    defaultValues: isCreateMode ? buildCreateDefaults() : buildEditDefaults(props.topic),
  })

  useEffect(() => {
    if (isCreateMode) {
      form.reset(buildCreateDefaults())
      return
    }
    form.reset(buildEditDefaults(props.topic))
  }, [form, isCreateMode, props])

  const isSubmitting = props.isPending || form.formState.isSubmitting

  async function handleSubmit(values: CreateShadowingTopicFormValues | EditShadowingTopicFormValues) {
    let coverImageUrl: string | undefined = isCreateMode ? undefined : props.topic.coverImageUrl ?? undefined

    if (values.coverImageFile) {
      coverImageUrl = await props.onUploadCoverImage(values.coverImageFile)
    }

    await props.onSubmit({
      title: values.title.trim(),
      description: values.description.trim(),
      coverImageUrl,
      level: values.level,
      visibility: values.visibility,
      status: values.status,
    })

    if (isCreateMode) {
      form.reset(buildCreateDefaults())
    }
  }

  return (
    <Dialog open={props.open} onOpenChange={props.onOpenChange}>
      <DialogContent className="flex max-h-[85vh] flex-col overflow-hidden sm:max-w-lg">
        <DialogHeader className="shrink-0">
          <DialogTitle>
            {isCreateMode ? SHADOWING_ADMIN_CONTENT.createTopicTitle : SHADOWING_ADMIN_CONTENT.editTopicTitle}
          </DialogTitle>
          <DialogDescription>
            {isCreateMode
              ? SHADOWING_ADMIN_CONTENT.createTopicDescription
              : SHADOWING_ADMIN_CONTENT.editTopicDescription}
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form className="flex min-h-0 flex-1 flex-col overflow-hidden" onSubmit={form.handleSubmit(handleSubmit)}>
            <div className="min-h-0 flex-1 space-y-4 overflow-y-auto pr-1">
            <FormField
              control={form.control}
              name="coverImageFile"
              render={({ field }) => (
                <FormItem className="gap-1.5">
                  <FormLabel>{SHADOWING_ADMIN_CONTENT.coverImageFileFieldLabel}</FormLabel>
                  <FormControl>
                    <ImageUpload
                      value={field.value ?? null}
                      onChange={(file) => field.onChange(file)}
                      defaultPreview={
                        isCreateMode ? undefined : resolveApiMediaUrl(props.topic.coverImageUrl) ?? undefined
                      }
                    />
                  </FormControl>
                  <p className="text-xs text-muted-foreground">{SHADOWING_ADMIN_CONTENT.coverImageUploadHint}</p>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem className="gap-1.5">
                  <FormLabel>{SHADOWING_ADMIN_CONTENT.titleFieldLabel}</FormLabel>
                  <FormControl>
                    <Input {...field} placeholder={SHADOWING_ADMIN_CONTENT.titleFieldPlaceholder} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem className="gap-1.5">
                  <FormLabel>{SHADOWING_ADMIN_CONTENT.descriptionFieldLabel}</FormLabel>
                  <FormControl>
                    <Textarea {...field} placeholder={SHADOWING_ADMIN_CONTENT.descriptionFieldPlaceholder} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="level"
                render={({ field }) => (
                  <FormItem className="gap-1.5">
                    <FormLabel>{SHADOWING_ADMIN_CONTENT.levelFieldLabel}</FormLabel>
                    <Select
                      value={field.value ?? '__none__'}
                      onValueChange={(value) => field.onChange(value === '__none__' ? undefined : value)}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder={SHADOWING_ADMIN_CONTENT.levelFilterPlaceholder} />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="__none__">{SHADOWING_ADMIN_CONTENT.levelEmptyOptionLabel}</SelectItem>
                        <SelectItem value="N5">{SHADOWING_LEVEL_LABELS.N5}</SelectItem>
                        <SelectItem value="N4">{SHADOWING_LEVEL_LABELS.N4}</SelectItem>
                        <SelectItem value="N3">{SHADOWING_LEVEL_LABELS.N3}</SelectItem>
                        <SelectItem value="N2">{SHADOWING_LEVEL_LABELS.N2}</SelectItem>
                        <SelectItem value="N1">{SHADOWING_LEVEL_LABELS.N1}</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="visibility"
                render={({ field }) => (
                  <FormItem className="gap-1.5">
                    <FormLabel>{SHADOWING_ADMIN_CONTENT.visibilityFieldLabel}</FormLabel>
                    <Select value={field.value} onValueChange={(value) => field.onChange(value as ShadowingVisibility)}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="Public">{SHADOWING_VISIBILITY_LABELS.Public}</SelectItem>
                        <SelectItem value="Private">{SHADOWING_VISIBILITY_LABELS.Private}</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="status"
              render={({ field }) => (
                <FormItem className="gap-1.5">
                  <FormLabel>{SHADOWING_ADMIN_CONTENT.statusFieldLabel}</FormLabel>
                  <Select value={field.value} onValueChange={(value) => field.onChange(value as ShadowingStatus)}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="Draft">{SHADOWING_STATUS_LABELS.Draft}</SelectItem>
                      <SelectItem value="Published">{SHADOWING_STATUS_LABELS.Published}</SelectItem>
                      <SelectItem value="Archived">{SHADOWING_STATUS_LABELS.Archived}</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            </div>
            <DialogFooter className="shrink-0 pt-4">
              <Button type="button" variant="outline" onClick={() => props.onOpenChange(false)}>
                {SHADOWING_ADMIN_CONTENT.cancelLabel}
              </Button>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting && <SpinnerGapIcon size={16} className="animate-spin" />}
                {isCreateMode ? SHADOWING_ADMIN_CONTENT.createConfirmLabel : SHADOWING_ADMIN_CONTENT.saveLabel}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}
