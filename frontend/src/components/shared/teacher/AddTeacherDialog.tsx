import { useForm } from 'react-hook-form'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
import { Plus, X, Check, Mail, User, Lock, Phone } from 'lucide-react'
import { CrudDialog } from '@/components/shared/CrudDialog'
import { useCreateTeacher } from '@/hooks/teacher/useTeachers'
import { useDepartments } from '@/hooks/department/useDepartments'
import { useSubjects } from '@/hooks/subject/useSubjects'
import { CreateTeacherInput, TEACHER_LEVEL_LABELS } from '@/types/teacher.types'
import { useState } from 'react'

export function AddTeacherDialog() {
  const [selectedSubjects, setSelectedSubjects] = useState<string[]>([])
  const [selectedDeptId, setSelectedDeptId] = useState('')

  const { register, handleSubmit, reset, watch, setValue,
    formState: { isDirty, errors } } =
    useForm<CreateTeacherInput>({
      defaultValues: { subjectIds: [] },
    })

  const mutation = useCreateTeacher(() => {
    reset()
    setSelectedSubjects([])
    setSelectedDeptId('')
  })

  const { data: depts } = useDepartments()
  const { data: subjects } = useSubjects({ limit: 100 })

  // Filter subjects by selected department
  const deptSubjects = (subjects?.data ?? []).filter(
    (s) => !selectedDeptId || s.deptId === selectedDeptId
  )

  const toggleSubject = (id: string) => {
    setSelectedSubjects((prev) =>
      prev.includes(id) ? prev.filter((s) => s !== id) : [...prev, id]
    )
  }

  const onSubmit = (data: CreateTeacherInput) => {

    if (!selectedDeptId) {
      alert("Please select a department");
      return;
    }
    if (selectedSubjects.length === 0) {
      alert("Please select at least one subject");
      return;
    }

    mutation.mutate({
      ...data,
      deptId: selectedDeptId || undefined,
      subjectIds: selectedSubjects,
    })
  }

  return (
    <CrudDialog
      trigger={
        <Button className="gap-2">
          <Plus className="size-4" />
          Add Teacher
        </Button>
      }
      title="Add teacher"
      description="Create a new teacher account with department and subject assignments."
      isPending={mutation.isPending}
      isSuccess={mutation.isSuccess}
      isError={mutation.isError}
      errorMessage={
        (mutation.error as any)?.response?.data?.message
        ?? 'Failed to create teacher'
      }
      submitLabel="Create Teacher"
      isDirty={isDirty || selectedSubjects.length > 0}
      onSubmit={handleSubmit(onSubmit)}
      onOpenChange={(open) => {
        if (!open) {
          reset()
          setSelectedSubjects([])
          setSelectedDeptId('')
          mutation.reset()
        }
      }}
    >
      {/* First + Last name */}
      <div className="grid grid-cols-2 gap-3">
        <div className="flex flex-col gap-1.5">
          <Label>First name</Label>
          <div className="relative">
            <User className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
            <Input
              placeholder="First name"
              className="pl-9"
              {...register('firstName', { required: ' FirstName is Required' })}
            />
          </div>
          {errors.firstName && (
            <p className="text-xs text-destructive">{errors.firstName.message}</p>
          )}
        </div>
        <div className="flex flex-col gap-1.5">
          <Label>Last name</Label>
          <Input
            placeholder="Last name"
            {...register('lastName', { required: 'LastName is Required' })}
          />
          {errors.lastName && (
            <p className="text-xs text-destructive">{errors.lastName.message}</p>
          )}
        </div>
      </div>

      {/* Email */}
      <div className="flex flex-col gap-1.5">
        <Label>Email</Label>
        <div className="relative">
          <Mail className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
          <Input
            type="email"
            placeholder="teacher@school.com"
            className="pl-9"
            {...register('email', {
              required: 'Email is Required',
              pattern: { value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/, message: 'Invalid email' },
            })}
          />
        </div>
        {errors.email && (
          <p className="text-xs text-destructive">{errors.email.message}</p>
        )}
      </div>

      {/* Password */}
      <div className="flex flex-col gap-1.5">
        <Label>Temporary password</Label>
        <div className="relative">
          <Lock className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
          <Input
            type="password"
            placeholder="Min 8 characters"
            className="pl-9"
            {...register('password', {
              required: 'Password is Required',
              minLength: { value: 8, message: 'Min 8 characters' },
            })}
          />
        </div>
        {errors.password && (
          <p className="text-xs text-destructive">{errors.password.message}</p>
        )}
      </div>

      {/* Phone */}
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

      {/* Level + Designation */}
      <div className="grid grid-cols-2 gap-3">
        <div className="flex flex-col gap-1.5">
          <Label>Teaching level <span className="text-destructive">*</span></Label>
          <select
            className={`h-10 w-full rounded-md border bg-background px-3 text-sm ${errors.level ? 'border-destructive' : 'border-input'}`}
            {...register('level', { required: 'Teaching level is required' })}
          >
            <option value="">Select level</option>
            {Object.entries(TEACHER_LEVEL_LABELS).map(([v, l]) => (
              <option key={v} value={v}>{l}</option>
            ))}
          </select>
          {errors.level && <p className="text-xs text-destructive">{errors.level.message}</p>}
        </div>


        <div className="flex flex-col gap-1.5">
          <Label>
            Designation
            <span className="text-muted-foreground ml-1 text-[10px]">(Optional)</span>
          </Label>
          <Input
            placeholder="e.g. Senior Teacher"
            {...register('designation')} // No validation here
          />
        </div>
      </div>

      {/* Department */}
      <div className="flex flex-col gap-1.5">
        <Label>Department <span className="text-destructive">*</span></Label>
        <select
          className="h-10 w-full rounded-md border border-input bg-background px-3 text-sm"
          value={selectedDeptId}
          required
          onChange={(e) => {
            setSelectedDeptId(e.target.value)
            setSelectedSubjects([])
          }}
        >
          <option value="">Select department</option>
          {(depts?.data ?? []).map((d) => (
            <option key={d.id} value={d.id}>{d.deptName}</option>
          ))}
        </select>
      </div>

      {/* Subjects (filtered by department) */}
      <div className="flex flex-col gap-1.5">
       <div className="flex items-center justify-between">
          <Label>Subjects <span className="text-destructive">*</span></Label>
          {selectedSubjects.length > 0 && (
            <Badge variant="secondary" className="text-xs">
              {selectedSubjects.length} selected
            </Badge>
          )}
        </div>

        <div className="border rounded-lg overflow-hidden">
          {!deptSubjects.length ? (
            <p className="p-3 text-center text-xs text-muted-foreground">
              {selectedDeptId
                ? 'No subjects in this department.'
                : 'Select a department to see subjects.'
              }
            </p>
          ) : (
            <div className="grid grid-cols-2 max-h-36 overflow-y-auto">
              {deptSubjects.map((subject) => {
                const isSelected = selectedSubjects.includes(subject.id)
                return (
                  <button
                    key={subject.id}
                    type="button"
                    onClick={() => toggleSubject(subject.id)}
                    className={`
                      flex items-center justify-between px-3 py-2
                      text-xs text-left transition-colors
                      border-b border-r border-border
                      ${isSelected
                        ? 'bg-primary/5 text-primary'
                        : 'hover:bg-muted/60'
                      }
                    `}
                  >
                    <span className="truncate">{subject.subjectName}</span>
                    {isSelected && <Check className="size-3 shrink-0 text-primary ml-1" />}
                  </button>
                )
              })}
            </div>
          )}
        </div>

        {selectedSubjects.length > 0 && (
          <div className="flex flex-wrap gap-1">
            {selectedSubjects.map((id) => {
              const s = subjects?.data.find((s) => s.id === id)
              return (
                <span
                  key={id}
                  className="inline-flex items-center gap-1 text-xs bg-primary/10 text-primary px-2 py-0.5 rounded-md"
                >
                  {s?.subjectName}
                  <button
                    type="button"
                    onClick={() => toggleSubject(id)}
                    className="hover:text-destructive ml-0.5"
                  >
                    <X className="size-3" />
                  </button>
                </span>
              )
            })}
          </div>
        )}
      </div>

    </CrudDialog>
  )
}