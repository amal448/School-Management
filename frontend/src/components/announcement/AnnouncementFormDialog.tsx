import { useForm } from 'react-hook-form'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { CrudDialog } from '@/components/shared/CrudDialog'
import {
  AnnouncementResponse,
  CreateAnnouncementInput,
  CATEGORY_LABELS,
} from '@/types/announcement.types'

export const AnnouncementFormDialog = ({
  announcement,
  trigger,
  onSave,
}: {
  announcement?: AnnouncementResponse
  trigger:       React.ReactNode
  onSave:        (data: CreateAnnouncementInput) => void
}) => {
  const isEdit = !!announcement

  const { register, handleSubmit, reset, formState: { isDirty, errors } } =
    useForm<CreateAnnouncementInput>({
      defaultValues: announcement
        ? {
            title:      announcement.title,
            content:    announcement.content,
            category:   announcement.category,
            eventDate:  announcement.eventDate?.split('T')[0] ?? '',
            isPublished: announcement.isPublished,
            isPinned:   announcement.isPinned,
          }
        : {
            category:   'notice',
            isPublished: false,
            isPinned:   false,
          },
    })

  return (
    <CrudDialog
      trigger={trigger}
      title={isEdit ? 'Edit announcement' : 'New announcement'}
      description={isEdit
        ? 'Update this announcement.'
        : 'Create a new announcement for the notice board.'
      }
      submitLabel={isEdit ? 'Save changes' : 'Create'}
      isDirty={isDirty}
      onSubmit={handleSubmit(onSave)}
      onOpenChange={(open) => { if (!open) reset() }}
    >
      <div className="flex flex-col gap-1.5">
        <Label>Title</Label>
        <Input
          placeholder="Announcement title"
          {...register('title', { required: 'Required' })}
        />
        {errors.title && (
          <p className="text-xs text-destructive">{errors.title.message}</p>
        )}
      </div>

      <div className="flex flex-col gap-1.5">
        <Label>Content</Label>
        <textarea
          rows={4}
          placeholder="Announcement content..."
          className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm resize-none focus:outline-none focus:ring-1 focus:ring-ring"
          {...register('content', { required: 'Required' })}
        />
        {errors.content && (
          <p className="text-xs text-destructive">{errors.content.message}</p>
        )}
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div className="flex flex-col gap-1.5">
          <Label>Category</Label>
          <select
            className="h-10 w-full rounded-md border border-input bg-background px-3 text-sm"
            {...register('category')}
          >
            {Object.entries(CATEGORY_LABELS).map(([v, l]) => (
              <option key={v} value={v}>{l}</option>
            ))}
          </select>
        </div>
        <div className="flex flex-col gap-1.5">
          <Label>
            Event date
            <span className="text-muted-foreground ml-1">(optional)</span>
          </Label>
          <Input type="date" {...register('eventDate')} />
        </div>
      </div>

      <div className="flex items-center gap-6">
        <label className="flex items-center gap-2 cursor-pointer">
          <input type="checkbox" className="size-4" {...register('isPublished')} />
          <span className="text-sm">Publish immediately</span>
        </label>
        <label className="flex items-center gap-2 cursor-pointer">
          <input type="checkbox" className="size-4" {...register('isPinned')} />
          <span className="text-sm">Pin to top</span>
        </label>
      </div>
    </CrudDialog>
  )
}
