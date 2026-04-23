import { useForm }        from 'react-hook-form'
import { Button }         from '@/components/ui/button'
import { Input }          from '@/components/ui/input'
import { Label }          from '@/components/ui/label'
import { Pencil, User, Phone, MapPin, Users } from 'lucide-react'
import { CrudDialog }     from '@/components/shared/CrudDialog'
import {  StudentEdItProps, UpdateStudentInput } from '@/types/student.types'


export function EditStudentDialog({ student, mutation }: StudentEdItProps) {
  const { register, handleSubmit, reset, formState: { isDirty, errors } } =
    useForm<UpdateStudentInput>({
      defaultValues: {
        firstName:       student.firstName,
        lastName:        student.lastName,
        address:         student.address         ?? '',
        guardianName:    student.guardianName     ?? '',
        guardianContact: student.guardianContact  ?? '',
      },
    })

  const handleOpenChange = (open: boolean) => {
    if (!open) {
      reset({
        firstName:       student.firstName,
        lastName:        student.lastName,
        address:         student.address         ?? '',
        guardianName:    student.guardianName     ?? '',
        guardianContact: student.guardianContact  ?? '',
      })
      mutation.reset()
    }
  }

  const onSubmit = (data: UpdateStudentInput) => {
    mutation.mutate({
      firstName:       data.firstName,
      lastName:        data.lastName,
      address:         data.address?.trim()         || undefined,
      guardianName:    data.guardianName?.trim()     || undefined,
      guardianContact: data.guardianContact?.trim()  || undefined,
    })
  }

  const errorMessage = (mutation.error as any)
    ?.response?.data?.message ?? 'Failed to update student'

  return (
    <CrudDialog
      trigger={
        <Button variant="outline" size="sm" className="gap-2">
          <Pencil className="size-4" />
          Edit
        </Button>
      }
      title="Edit student"
      description={`Update ${student.firstName}'s profile.`}
      isPending={mutation.isPending}
      isSuccess={mutation.isSuccess}
      isError={mutation.isError}
      errorMessage={errorMessage}
      submitLabel="Save changes"
      isDirty={isDirty}
      onSubmit={handleSubmit(onSubmit)}
      onOpenChange={handleOpenChange}
    >
      {/* First + Last name */}
      <div className="grid grid-cols-2 gap-3">
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="es-firstName">First name</Label>
          <div className="relative">
            <User className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
            <Input
              id="es-firstName"
              placeholder="John"
              className="pl-9"
              {...register('firstName', {
                required:  'Required',
                minLength: { value: 2, message: 'Too short' },
              })}
            />
          </div>
          {errors.firstName && (
            <p className="text-xs text-destructive">{errors.firstName.message}</p>
          )}
        </div>

        <div className="flex flex-col gap-1.5">
          <Label htmlFor="es-lastName">Last name</Label>
          <Input
            id="es-lastName"
            placeholder="Doe"
            {...register('lastName', {
              required:  'Required',
              minLength: { value: 2, message: 'Too short' },
            })}
          />
          {errors.lastName && (
            <p className="text-xs text-destructive">{errors.lastName.message}</p>
          )}
        </div>
      </div>

     

      {/* Address */}
      <div className="flex flex-col gap-1.5">
        <Label htmlFor="es-address">
          Address
          <span className="text-muted-foreground ml-1">(optional)</span>
        </Label>
        <div className="relative">
          <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
          <Input
            id="es-address"
            placeholder="Home address"
            className="pl-9"
            {...register('address')}
          />
        </div>
      </div>

      {/* Guardian name + contact */}
      <div className="grid grid-cols-2 gap-3">
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="es-guardian">
            Guardian
            <span className="text-muted-foreground ml-1">(optional)</span>
          </Label>
          <div className="relative">
            <Users className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
            <Input
              id="es-guardian"
              placeholder="Guardian name"
              className="pl-9"
              {...register('guardianName')}
            />
          </div>
        </div>

        <div className="flex flex-col gap-1.5">
          <Label htmlFor="es-guardianContact">
            Guardian contact
            <span className="text-muted-foreground ml-1">(optional)</span>
          </Label>
          <div className="relative">
            <Phone className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
            <Input
              id="es-guardianContact"
              type="tel"
              placeholder="Guardian phone"
              className="pl-9"
              {...register('guardianContact')}
            />
          </div>
        </div>
      </div>
    </CrudDialog>
  )
}