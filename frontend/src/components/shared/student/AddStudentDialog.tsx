import { useForm }         from 'react-hook-form'
import { Button }          from '@/components/ui/button'
import { Input }           from '@/components/ui/input'
import { Label }           from '@/components/ui/label'
import { Plus, Mail, User, Lock, Phone, Users } from 'lucide-react'
import { CrudDialog }      from '@/components/shared/CrudDialog'
import { useCreateStudent } from '@/hooks/student/useStudents'
import { AddStudentProps, CreateStudentInput } from '@/types/student.types'


export function AddStudentDialog({ classId }: AddStudentProps) {
  const { register, handleSubmit, reset, formState: { isDirty, errors } } =
    useForm<CreateStudentInput>({
      defaultValues: { classId },
    })

  const mutation = useCreateStudent(() => reset({ classId }))

  const errorMessage = (mutation.error as any)
    ?.response?.data?.message ?? 'Failed to create student'

  return (
    <CrudDialog
      trigger={
        <Button className="gap-2">
          <Plus className="size-4" />
          Add Student
        </Button>
      }
      title="Add student"
      description="Create a new student account."
      isPending={mutation.isPending}
      isSuccess={mutation.isSuccess}
      isError={mutation.isError}
      errorMessage={errorMessage}
      submitLabel="Create Student"
      isDirty={isDirty}
      onSubmit={handleSubmit((data) => mutation.mutate(data))}
      onOpenChange={(open) => {
        if (!open) { reset({ classId }); mutation.reset() }
      }}
    >
      {/* First + Last name */}
      <div className="grid grid-cols-2 gap-3">
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="st-firstName">First name</Label>
          <div className="relative">
            <User className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
            <Input
              id="st-firstName"
              placeholder="John"
              className="pl-9"
              {...register('firstName', { required: 'Required' })}
            />
          </div>
          {errors.firstName && (
            <p className="text-xs text-destructive">{errors.firstName.message}</p>
          )}
        </div>

        <div className="flex flex-col gap-1.5">
          <Label htmlFor="st-lastName">Last name</Label>
          <Input
            id="st-lastName"
            placeholder="Doe"
            {...register('lastName', { required: 'Required' })}
          />
          {errors.lastName && (
            <p className="text-xs text-destructive">{errors.lastName.message}</p>
          )}
        </div>
      </div>

      {/* Email */}
      <div className="flex flex-col gap-1.5">
        <Label htmlFor="st-email">Email</Label>
        <div className="relative">
          <Mail className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
          <Input
            id="st-email"
            type="email"
            placeholder="student@school.com"
            className="pl-9"
            {...register('email', {
              required: 'Email is required',
              pattern: {
                value:   /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                message: 'Invalid email',
              },
            })}
          />
        </div>
        {errors.email && (
          <p className="text-xs text-destructive">{errors.email.message}</p>
        )}
      </div>

      {/* Password */}
      <div className="flex flex-col gap-1.5">
        <Label htmlFor="st-password">Temporary password</Label>
        <div className="relative">
          <Lock className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
          <Input
            id="st-password"
            type="password"
            placeholder="Min 8 characters"
            className="pl-9"
            {...register('password', {
              required:  'Password is required',
              minLength: { value: 8, message: 'Min 8 characters' },
            })}
          />
        </div>
        {errors.password && (
          <p className="text-xs text-destructive">{errors.password.message}</p>
        )}
        <p className="text-xs text-muted-foreground">
          Student must change this on first login.
        </p>
      </div>

      {/* Guardian + Phone in a row */}
      <div className="flex flex-col gap-1.5">
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="st-guardian">
            Guardian
            <span className="text-muted-foreground ml-1">(optional)</span>
          </Label>
          <div className="relative">
            <Users className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
            <Input
              id="st-guardian"
              placeholder="Guardian name"
              className="pl-9"
              {...register('guardianName')}
            />
          </div>
        </div>

       
      </div>

      {/* Guardian contact */}
      <div className="flex flex-col gap-1.5">
        <Label htmlFor="st-guardianContact">
          Guardian contact
          <span className="text-muted-foreground ml-1">(optional)</span>
        </Label>
        <div className="relative">
          <Phone className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
          <Input
            id="st-guardianContact"
            type="tel"
            placeholder="Guardian phone number"
            className="pl-9"
            {...register('guardianContact')}
          />
        </div>
      </div>

      {/* Hidden classId */}
      {classId && (
        <input type="hidden" value={classId} {...register('classId')} />
      )}
    </CrudDialog>
  )
}