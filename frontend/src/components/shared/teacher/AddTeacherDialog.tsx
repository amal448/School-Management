import { useState }      from 'react'
import { useForm }       from 'react-hook-form'
import { Button }        from '@/components/ui/button'
import {
  Dialog, DialogClose, DialogContent,
  DialogDescription, DialogFooter,
  DialogHeader, DialogTitle, DialogTrigger,
} from '@/components/ui/dialog'
import { Input }         from '@/components/ui/input'
import { Label }         from '@/components/ui/label'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { AlertCircle, Plus, Mail, User, Lock, Phone } from 'lucide-react'
import { useCreateTeacher } from '@/hooks/teacher/useTeachers'
import { CreateTeacherInput } from '@/types/teacher.types'

const Spinner = () => (
  <div className="size-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
)

export function AddTeacherDialog() {
  const [open, setOpen] = useState(false)

  const { register, handleSubmit, reset, formState: { errors } } =
    useForm<CreateTeacherInput>()

  const mutation = useCreateTeacher(() => {
    reset()
    setOpen(false)
  })

  const onSubmit = (data: CreateTeacherInput) => mutation.mutate(data)

  const errorMessage = (mutation.error as any)
    ?.response?.data?.message ?? 'Failed to create teacher'

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="gap-2">
          <Plus className="size-4" />
          Add Teacher
        </Button>
      </DialogTrigger>

      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Add Teacher</DialogTitle>
          <DialogDescription>
            Create a teacher account. They will receive a setup link to set their password.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="flex flex-col gap-4 py-2">

            {mutation.isError && (
              <Alert variant="destructive" className="py-3">
                <AlertCircle className="size-4" />
                <AlertDescription className="text-xs">
                  {errorMessage}
                </AlertDescription>
              </Alert>
            )}

            {/* First + Last name */}
            <div className="grid grid-cols-2 gap-3">
              <div className="flex flex-col gap-1.5">
                <Label htmlFor="tf-firstName">First name</Label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
                  <Input
                    id="tf-firstName"
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
                <Label htmlFor="tf-lastName">Last name</Label>
                <Input
                  id="tf-lastName"
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
              <Label htmlFor="tf-email">Email</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
                <Input
                  id="tf-email"
                  type="email"
                  placeholder="teacher@school.com"
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
              <Label htmlFor="tf-password">Temporary password</Label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
                <Input
                  id="tf-password"
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
                Teacher must change this on first login.
              </p>
            </div>

            {/* Phone optional */}
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="tf-phone">
                Phone
              </Label>
              <div className="relative">
                <Phone className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
                <Input
                  id="tf-phone"
                  type="tel"
                  placeholder="+91 98765 43210"
                  className="pl-9"
                  {...register('phone')}
                />
              </div>
            </div>

            {/* Designation optional */}
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="tf-designation">
                Designation
                <span className="text-muted-foreground ml-1">(optional)</span>
              </Label>
              <Input
                id="tf-designation"
                placeholder="Senior Lecturer"
                {...register('designation')}
              />
            </div>
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="tf-designation">
                Qualification
              </Label>
              <Input
                id="tf-designation"
                placeholder="Senior Lecturer"
                {...register('designation')}
              />
            </div>
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="tf-designation">
                Department
              </Label>
              <Input
                id="tf-designation"
                placeholder="Senior Lecturer"
                {...register('designation')}
              />
            </div>

          </div>

          <DialogFooter className="mt-4">
            <DialogClose asChild>
              <Button type="button" variant="outline">Cancel</Button>
            </DialogClose>
            <Button type="submit" disabled={mutation.isPending}>
              {mutation.isPending ? <><Spinner /> Creating...</> : 'Create Teacher'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}