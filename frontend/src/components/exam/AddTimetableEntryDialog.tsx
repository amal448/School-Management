import { useForm }               from 'react-hook-form'
import { Button }                from '@/components/ui/button'
import { Input }                 from '@/components/ui/input'
import { Label }                 from '@/components/ui/label'
import { Plus }                  from 'lucide-react'
import { CrudDialog }            from '@/components/shared/CrudDialog'
import { useAddTimetableEntry }  from '@/hooks/exam/useExams'
import { useSubjects }           from '@/hooks/subject/useSubjects'
import { CreateTimetableEntryInput } from '@/types/exam.types'

interface Props { examId: string }

export const AddTimetableEntryDialog = ({ examId }: Props) => {
  const { register, handleSubmit, reset, formState: { isDirty, errors } } =
    useForm<CreateTimetableEntryInput>({
      defaultValues: { totalMarks: 100, passingMarks: 35 },
    })

  const mutation         = useAddTimetableEntry(examId)
  const { data: subjects } = useSubjects({ limit: 100 })

  return (
    <CrudDialog
      trigger={
        <Button variant="outline" className="gap-2">
          <Plus className="size-4" />
          Add subject
        </Button>
      }
      title="Add timetable entry"
      description="Schedule a subject for this exam."
      isPending={mutation.isPending}
      isSuccess={mutation.isSuccess}
      isError={mutation.isError}
      errorMessage={
        (mutation.error as any)?.response?.data?.message
          ?? 'Failed to add entry'
      }
      submitLabel="Add entry"
      isDirty={isDirty}
      onSubmit={handleSubmit((data) => mutation.mutate(data))}
      onOpenChange={(open) => { if (!open) { reset(); mutation.reset() } }}
    >
      {/* Subject */}
      <div className="flex flex-col gap-1.5">
        <Label>Subject</Label>
        <select
          className="h-10 w-full rounded-md border border-input bg-background px-3 text-sm"
          {...register('subjectId', { required: 'Required' })}
        >
          <option value="">Select subject</option>
          {subjects?.data.map((s) => (
            <option key={s.id} value={s.id}>{s.subjectName}</option>
          ))}
        </select>
        {errors.subjectId && (
          <p className="text-xs text-destructive">{errors.subjectId.message}</p>
        )}
      </div>

      {/* Exam date + times */}
      <div className="flex flex-col gap-1.5">
        <Label>Exam date</Label>
        <Input
          type="date"
          {...register('examDate', { required: 'Required' })}
        />
        {errors.examDate && (
          <p className="text-xs text-destructive">{errors.examDate.message}</p>
        )}
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div className="flex flex-col gap-1.5">
          <Label>Start time</Label>
          <Input
            type="time"
            {...register('startTime', { required: 'Required' })}
          />
        </div>
        <div className="flex flex-col gap-1.5">
          <Label>End time</Label>
          <Input
            type="time"
            {...register('endTime', { required: 'Required' })}
          />
        </div>
      </div>

      {/* Marks */}
      <div className="grid grid-cols-2 gap-3">
        <div className="flex flex-col gap-1.5">
          <Label>Total marks</Label>
          <Input
            type="number"
            {...register('totalMarks', {
              required:  'Required',
              valueAsNumber: true,
              min: { value: 1, message: 'Min 1' },
            })}
          />
        </div>
        <div className="flex flex-col gap-1.5">
          <Label>Passing marks</Label>
          <Input
            type="number"
            {...register('passingMarks', {
              required:  'Required',
              valueAsNumber: true,
              min: { value: 1, message: 'Min 1' },
            })}
          />
        </div>
      </div>
    </CrudDialog>
  )
}