import { useForm } from 'react-hook-form'
import { Button } from '@/components/ui/button'
import {
  Dialog, DialogClose, DialogContent,
  DialogDescription, DialogFooter,
  DialogHeader, DialogTitle, DialogTrigger,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { AlertCircle, Pencil, Phone, User } from 'lucide-react'
import { EditManagerForm, EditProps } from '@/types/manager.types'
import { Spinner } from '../shared/Helpercomponents'


export function EditManagerDialog({ manager, mutation, onClose }: EditProps) {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isDirty },
  } = useForm<EditManagerForm>({
    defaultValues: {
      firstName: manager.firstName,
      lastName: manager.lastName,
      phone: manager.phone ?? '',
    },
  })

  const handleOpenChange = (open: boolean) => {
    if (!open) {
      // Reset form to current manager values when dialog closes
      reset({
        firstName: manager.firstName,
        lastName: manager.lastName,
        phone: manager.phone ?? '',
      })
      mutation.reset()
      onClose?.()
    }
  }

  const onSubmit = (data: EditManagerForm) => {
    mutation.mutate({
      firstName: data.firstName,
      lastName: data.lastName,
      phone: data.phone?.trim() || undefined,
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
                      required: 'Required',
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
                    required: 'Required',
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
  <Label htmlFor="phone">Phone Number</Label>
  <div className="relative">
    <Phone className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
    <Input
      id="phone"
      type="tel"
      placeholder="919876543210"
      className="pl-9"
      // Native HTML attribute to stop typing after 12 chars
      maxLength={12} 
      {...register('phone', { 
        required: 'Phone number is required',
        // Minimum length (usually 10 for basic mobile)
        minLength: { 
          value: 10, 
          message: 'Phone number must be at least 10 digits' 
        },
        // Maximum length (to match your backend API limit)
        maxLength: { 
          value: 12, 
          message: 'Phone number cannot exceed 12 digits' 
        },
        // Pattern to ensure ONLY digits (removes spaces, +, and dashes)
        pattern: {
          value: /^[0-9]+$/,
          message: 'Please enter digits only (no spaces or +)'
        }
      })}
    />
  </div>
  {errors.phone && (
    <p className="text-[10px] font-medium text-destructive mt-1">
      {errors.phone.message}
    </p>
  )}
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