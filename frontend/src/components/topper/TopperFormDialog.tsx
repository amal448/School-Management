import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { CrudDialog } from '@/components/shared/CrudDialog'
import { ImageUploader } from './ImageUploader'
import { TopperResponse, CreateTopperInput } from '@/types/topper.types'
import { CURRENT_ACADEMIC_YEAR, ACADEMIC_YEAR_OPTIONS } from '@/constants/exam.constants'

export const TopperFormDialog = ({
  topper,
  trigger,
  onSave,
  mutation,
}: {
  topper?: TopperResponse
  trigger: React.ReactNode
  onSave: (data: CreateTopperInput) => void
  mutation?: any // Added mutation prop to fix TopperRow implicit any error
}) => {
  const [photoUrl, setPhotoUrl] = useState(topper?.photoUrl ?? '')
  const isEdit = !!topper

  const { register, handleSubmit, reset, formState: { isDirty, errors } } =
    useForm<CreateTopperInput>({
      defaultValues: topper
        ? {
          name: topper.name,
          grade: topper.grade,
          department: topper.department ?? '',
          marks: topper.marks,
          totalMarks: topper.totalMarks,
          rank: topper.rank,
          academicYear: topper.academicYear,
          isPublished: topper.isPublished,
        }
        : {
          grade: '10',
          academicYear: CURRENT_ACADEMIC_YEAR,
          isPublished: false,
        },
    })

  return (
    <CrudDialog
      trigger={trigger}
      title={isEdit ? 'Edit topper' : 'Add topper'}
      description="Add a board topper for display on the public site."
      submitLabel={isEdit ? 'Save changes' : 'Add topper'}
      isDirty={isDirty || photoUrl !== (topper?.photoUrl ?? '')}
      onSubmit={handleSubmit(
        (data) => onSave({ ...data, photoUrl: photoUrl || undefined }),
        (errors) => console.log("FORM VALIDATION ERRORS:", errors)
      )}
      onOpenChange={(open) => {
        if (!open) {
          reset()
          setPhotoUrl(topper?.photoUrl ?? '')
        }
      }}
      isLoading={mutation?.isPending}
    >
      {/* Photo */}
      <div className="flex flex-col gap-1.5">
        <ImageUploader value={photoUrl} onChange={setPhotoUrl} />
      </div>

      {/* Name */}
      <div className="flex flex-col gap-1.5">
        <Label>Student name</Label>
        <Input
          placeholder="Full name"
          {...register('name', { required: 'Required' })}
        />
        {errors.name && (
          <p className="text-xs text-destructive">{errors.name.message}</p>
        )}
      </div>

      {/* Grade + Rank */}
      <div className="grid grid-cols-2 gap-3">
        <div className="flex flex-col gap-1.5">
          <Label>Grade</Label>
          <select
            className="h-10 w-full rounded-md border border-input bg-background px-3 text-sm"
            {...register('grade', { required: 'Required' })}
          >
            {['1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12'].map((g) => (
              <option key={g} value={g}>Grade {g}</option>
            ))}
          </select>
        </div>
        <div className="flex flex-col gap-1.5">
          <Label>Rank</Label>
          <select
            className="h-10 w-full rounded-md border border-input bg-background px-3 text-sm"
            {...register('rank', {
              setValueAs: (v) => (v === '' ? undefined : Number(v)),
            })}
          >
            <option value="">Select Rank (optional)</option>
            {[1, 2, 3].map((r) => (
              <option key={r} value={r}>
                Rank {r}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* marks */}
      <div className="flex flex-col gap-1.5">
        <Label>Marks</Label>
        <Input
          type="number"
          placeholder="enter the mark scored"
          {...register('marks', {
            required: 'Required',
          })}
        />
        {errors.marks && (
          <p className="text-xs text-destructive">{errors.marks.message}</p>
        )}
      </div>
      <div className="flex flex-col gap-1.5">
        <Label>TotalMarks</Label>
        <Input
          type="number"
          placeholder="enter the total mark"
          {...register('totalMarks', {
            required: 'Required',
          })}
        />
        {errors.totalMarks && (
          <p className="text-xs text-destructive">{errors.totalMarks.message}</p>
        )}
      </div>

      {/* Department + Year */}
      <div className="grid grid-cols-2 gap-3">
        <div className="flex flex-col gap-1.5">
          <Label>Department <span className="text-muted-foreground">(optional)</span></Label>
          <Input
            placeholder="Science, Commerce..."
            {...register('department')}
          />
        </div>
        <div className="flex flex-col gap-1.5">
          <Label>Academic year</Label>
          <select
            className="h-10 w-full rounded-md border border-input bg-background px-3 text-sm"
            {...register('academicYear')}
          >
            {ACADEMIC_YEAR_OPTIONS.map((y) => (
              <option key={y} value={y}>{y}</option>
            ))}
          </select>
        </div>
      </div>

      <label className="flex items-center gap-2 cursor-pointer">
        <input type="checkbox" className="size-4" {...register('isPublished')} />
        <span className="text-sm">Publish immediately</span>
      </label>
    </CrudDialog>
  )
}
