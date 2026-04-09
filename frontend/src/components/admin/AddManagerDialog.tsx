// src/components/admin/AddManagerDialog.tsx
import { useState } from 'react'
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
import { AlertCircle, Plus, Mail, User, Lock, Phone } from 'lucide-react'
import {
  useCreateManagerCustom,
  useWhitelistManager,
} from '@/hooks/admin/useManagers'
import {
  CreateManagerCustomInput,
  WhitelistManagerInput,
} from '@/types/manager.types'


// ── Spinner ────────────────────────────────────────────
const Spinner = () => (
  <div className="size-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
)

// ── Main component ─────────────────────────────────────
export function AddManagerDialog() {
  const [open, setOpen] = useState(false)

  const handleSuccess = () => setOpen(false)

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="gap-2">
          <Plus className="size-4" />
          Add Manager
        </Button>
      </DialogTrigger>

      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Add Manager</DialogTitle>
          <DialogDescription>
            Create a manager account directly or whitelist their email
            so they can register themselves.
          </DialogDescription>
        </DialogHeader>


        <CustomForm onSuccess={handleSuccess} />


      </DialogContent>
    </Dialog>
  )
}

// ─────────────────────────────────────────────────────────
// Custom credentials form
// ─────────────────────────────────────────────────────────
interface CustomFormProps {
  onSuccess: () => void
}

function CustomForm({ onSuccess }: CustomFormProps) {
  const { register, handleSubmit, reset, formState: { errors } } =
    useForm<CreateManagerCustomInput>()

  const mutation = useCreateManagerCustom(() => {
    reset()
    onSuccess()
  })

  const onSubmit = (data: CreateManagerCustomInput) => {
    mutation.mutate(data)
  }

  const errorMessage = (mutation.error as any)
    ?.response?.data?.message ?? 'Failed to create manager'

  return (
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

        {/* First name + Last name row */}
        <div className="grid grid-cols-2 gap-3">
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="firstName">First name</Label>
            <div className="relative">
              <User className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
              <Input
                id="firstName"
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
            <Label htmlFor="lastName">Last name</Label>
            <Input
              id="lastName"
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
          <Label htmlFor="email">Email</Label>
          <div className="relative">
            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
            <Input
              id="email"
              type="email"
              placeholder="manager@school.com"
              className="pl-9"
              {...register('email', {
                required: 'Email is required',
                pattern: {
                  value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                  message: 'Invalid email address',
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
          <Label htmlFor="password">Temporary password</Label>
          <div className="relative">
            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
            <Input
              id="password"
              type="password"
              placeholder="Min 8 characters"
              className="pl-9"
              {...register('password', {
                required: 'Password is required',
                minLength: { value: 8, message: 'Min 8 characters' },
              })}
            />
          </div>
          {errors.password && (
            <p className="text-xs text-destructive">{errors.password.message}</p>
          )}
          <p className="text-xs text-muted-foreground">
            Manager will be required to change this on first login.
          </p>
        </div>

        {/* Phone (optional) */}
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
        <DialogClose asChild>
          <Button type="button" variant="outline">Cancel</Button>
        </DialogClose>
        <Button type="submit" disabled={mutation.isPending}>
          {mutation.isPending ? (
            <><Spinner /> Creating...</>
          ) : (
            'Create Manager'
          )}
        </Button>
      </DialogFooter>
    </form>
  )
}

// ─────────────────────────────────────────────────────────
// Whitelist form
// ─────────────────────────────────────────────────────────
interface WhitelistFormProps {
  onSuccess: () => void
}

function WhitelistForm({ onSuccess }: WhitelistFormProps) {
  const { register, handleSubmit, reset, formState: { errors } } =
    useForm<WhitelistManagerInput>()

  const mutation = useWhitelistManager(() => {
    reset()
    onSuccess()
  })

  const onSubmit = (data: WhitelistManagerInput) => {
    mutation.mutate(data)
  }

  const errorMessage = (mutation.error as any)
    ?.response?.data?.message ?? 'Failed to whitelist email'

  return (
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

        {/* Explanation */}
        <div className="rounded-lg bg-muted px-4 py-3 text-sm text-muted-foreground">
          <p>The manager will receive a setup link to create their password and activate their account.</p>
        </div>

        {/* Email */}
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="whitelist-email">Manager email</Label>
          <div className="relative">
            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
            <Input
              id="whitelist-email"
              type="email"
              placeholder="manager@school.com"
              className="pl-9"
              {...register('email', {
                required: 'Email is required',
                pattern: {
                  value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                  message: 'Invalid email address',
                },
              })}
            />
          </div>
          {errors.email && (
            <p className="text-xs text-destructive">{errors.email.message}</p>
          )}
        </div>

      </div>

      <DialogFooter className="mt-4">
        <DialogClose asChild>
          <Button type="button" variant="outline">Cancel</Button>
        </DialogClose>
        <Button type="submit" disabled={mutation.isPending}>
          {mutation.isPending ? (
            <><Spinner /> Whitelisting...</>
          ) : (
            'Whitelist Email'
          )}
        </Button>
      </DialogFooter>
    </form>
  )
}