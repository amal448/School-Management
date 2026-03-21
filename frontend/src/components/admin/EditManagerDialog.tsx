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
import { AlertCircle, Pencil, Phone, User } from 'lucide-react'
import { UseMutationResult }  from '@tanstack/react-query'
import { ManagerResponse, UpdateManagerInput } from '@/types/manager.types'

export interface EditManagerForm {
  firstName: string
  lastName:  string
  phone?:    string
}

interface Props {
  manager:  ManagerResponse
  mutation: UseMutationResult<ManagerResponse, Error, UpdateManagerInput>
  onClose?: () => void
}

const Spinner = () => (
  <div className="size-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
)

export function EditManagerDialog({ manager, mutation, onClose }: Props) {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isDirty },
  } = useForm<EditManagerForm>({
    defaultValues: {
      firstName: manager.firstName,
      lastName:  manager.lastName,
      phone:     manager.phone ?? '',
    },
  })

  const handleOpenChange = (open: boolean) => {
    if (!open) {
      // Reset form to current manager values when dialog closes
      reset({
        firstName: manager.firstName,
        lastName:  manager.lastName,
        phone:     manager.phone ?? '',
      })
      mutation.reset()
      onClose?.()
    }
  }

  const onSubmit = (data: EditManagerForm) => {
    mutation.mutate({
      firstName: data.firstName,
      lastName:  data.lastName,
      phone:     data.phone?.trim() || undefined,
    })
  }

  const errorMessage = (mutation.error as any)
    ?.response?.data?.message ?? 'Failed to update manager'

  return (
    <Dialog onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm" className="gap-2">
          <Pencil className="size-4" />
          Edit
        </Button>
      </DialogTrigger>

      <DialogContent className="sm:max-w-sm">
        <DialogHeader>
          <DialogTitle>Edit manager</DialogTitle>
          <DialogDescription>
            Update {manager.firstName}'s profile details.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="flex flex-col gap-4 py-2">

            {mutation.isSuccess && (
              <Alert className="py-3 border-green-200 bg-green-50 dark:bg-green-950/20">
                <AlertDescription className="text-xs text-green-700 dark:text-green-400">
                  Profile updated successfully.
                </AlertDescription>
              </Alert>
            )}

            {mutation.isError && (
              <Alert variant="destructive" className="py-3">
                <AlertCircle className="size-4" />
                <AlertDescription className="text-xs">
                  {errorMessage}
                </AlertDescription>
              </Alert>
            )}

            <div className="grid grid-cols-2 gap-3">
              <div className="flex flex-col gap-1.5">
                <Label htmlFor="em-firstName">First name</Label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
                  <Input
                    id="em-firstName"
                    placeholder="John"
                    className="pl-9"
                    {...register('firstName', {
                      required:  'Required',
                      minLength: { value: 2, message: 'Too short' },
                    })}
                  />
                </div>
                {errors.firstName && (
                  <p className="text-xs text-destructive">
                    {errors.firstName.message}
                  </p>
                )}
              </div>

              <div className="flex flex-col gap-1.5">
                <Label htmlFor="em-lastName">Last name</Label>
                <Input
                  id="em-lastName"
                  placeholder="Doe"
                  {...register('lastName', {
                    required:  'Required',
                    minLength: { value: 2, message: 'Too short' },
                  })}
                />
                {errors.lastName && (
                  <p className="text-xs text-destructive">
                    {errors.lastName.message}
                  </p>
                )}
              </div>
            </div>

            <div className="flex flex-col gap-1.5">
              <Label htmlFor="em-phone">
                Phone
                <span className="text-muted-foreground ml-1">(optional)</span>
              </Label>
              <div className="relative">
                <Phone className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
                <Input
                  id="em-phone"
                  type="tel"
                  placeholder="+91 98765 43210"
                  className="pl-9"
                  {...register('phone')}
                />
              </div>
            </div>

          </div>

          <DialogFooter className="mt-4">
            {mutation.isSuccess ? (
              <DialogClose asChild>
                <Button type="button">Done</Button>
              </DialogClose>
            ) : (
              <>
                <DialogClose asChild>
                  <Button type="button" variant="outline">Cancel</Button>
                </DialogClose>
                <Button
                  type="submit"
                  disabled={mutation.isPending || !isDirty}
                >
                  {mutation.isPending
                    ? <><Spinner /> Saving...</>
                    : 'Save changes'
                  }
                </Button>
              </>
            )}
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}