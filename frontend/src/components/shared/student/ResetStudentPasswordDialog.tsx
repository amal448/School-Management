import { useForm }                from 'react-hook-form'
import { Button }                 from '@/components/ui/button'
import { Input }                  from '@/components/ui/input'
import { Label }                  from '@/components/ui/label'
import { KeyRound }               from 'lucide-react'
import { CrudDialog }             from '@/components/shared/CrudDialog'
import { useResetStudentPassword } from '@/hooks/student/useStudents'
import { ResetFormValues, StudentResetProps } from '@/types/student.types'


export const ResetStudentPasswordDialog = ({
  studentId,
  studentName,
}: StudentResetProps) => {
  const {
    register,
    handleSubmit,
    reset,
    watch,
    formState: { isDirty, errors },
  } = useForm<ResetFormValues>()

  const mutation = useResetStudentPassword()

  const onSubmit = (data: ResetFormValues) => {
    mutation.mutate({ studentId, newPassword: data.newPassword })
  }

  return (
    <CrudDialog
      trigger={
        <Button variant="outline" size="sm" className="gap-2 text-xs h-7">
          <KeyRound className="size-3.5" />
          Reset password
        </Button>
      }
      title="Reset student password"
      description={`Set a new temporary password for ${studentName}.`}
      isPending={mutation.isPending}
      isSuccess={mutation.isSuccess}
      isError={mutation.isError}
      errorMessage={
        (mutation.error as any)?.response?.data?.message
          ?? 'Failed to reset password'
      }
      submitLabel="Reset Password"
      isDirty={isDirty}
      onSubmit={handleSubmit(onSubmit)}
      onOpenChange={(open) => {
        if (!open) { reset(); mutation.reset() }
      }}
    >
      <div className="flex flex-col gap-1.5">
        <Label>New password</Label>
        <Input
          type="password"
          placeholder="Min 8 characters"
          {...register('newPassword', {
            required:  'Required',
            minLength: { value: 8, message: 'Min 8 characters' },
          })}
        />
        {errors.newPassword && (
          <p className="text-xs text-destructive">
            {errors.newPassword.message}
          </p>
        )}
      </div>

      <div className="flex flex-col gap-1.5">
        <Label>Confirm password</Label>
        <Input
          type="password"
          placeholder="Repeat password"
          {...register('confirmPassword', {
            required: 'Required',
            validate: (v) =>
              v === watch('newPassword') || 'Passwords do not match',
          })}
        />
        {errors.confirmPassword && (
          <p className="text-xs text-destructive">
            {errors.confirmPassword.message}
          </p>
        )}
      </div>

      <p className="text-xs text-muted-foreground">
        Student will be prompted to change this on next login.
      </p>
    </CrudDialog>
  )
}