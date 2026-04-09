import { useState }          from 'react'
import { useForm }           from 'react-hook-form'
import { Button }            from '@/components/ui/button'
import {
  Dialog, DialogClose, DialogContent,
  DialogDescription, DialogFooter,
  DialogHeader, DialogTitle, DialogTrigger,
} from '@/components/ui/dialog'
import { Input }             from '@/components/ui/input'
import { Label }             from '@/components/ui/label'
import { Badge }             from '@/components/ui/badge'
import { Alert, AlertDescription } from '@/components/ui/alert'
import {
  AlertCircle, Pencil, Phone, User,
  MapPin, Briefcase, GraduationCap, Check, X,
} from 'lucide-react'
import { UseMutationResult } from '@tanstack/react-query'
import {
  TeacherResponse,
  UpdateTeacherInput,
  TEACHER_LEVEL_LABELS,
  TeacherLevel,
} from '@/types/teacher.types'
import { useDepartments }    from '@/hooks/department/useDepartments'
import { useSubjects }       from '@/hooks/subject/useSubjects'

interface EditForm {
  firstName:     string
  lastName:      string
  phone:         string
  address:       string
  qualification: string
  designation:   string
  level:         TeacherLevel | ''
}

interface Props {
  teacher:  TeacherResponse
  mutation: UseMutationResult<TeacherResponse, Error, UpdateTeacherInput>
}

const Spinner = () => (
  <div className="size-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
)

export function EditTeacherDialog({ teacher, mutation }: Props) {
  const [selectedSubjects, setSelectedSubjects] = useState<string[]>(
    teacher.subjectIds ?? []
  )

  const { register, handleSubmit, reset, formState: { errors, isDirty } } =
    useForm<EditForm>({
      defaultValues: {
        firstName:     teacher.firstName,
        lastName:      teacher.lastName,
        phone:         teacher.phone         ?? '',
        address:       teacher.address       ?? '',
        qualification: teacher.qualification ?? '',
        designation:   teacher.designation   ?? '',
        level:         (teacher.level as TeacherLevel) ?? '',
      },
    })

  const { data: depts }    = useDepartments()
  const { data: subjects } = useSubjects({ limit: 100 })

  // Filter subjects by teacher's current department
  const deptSubjects = (subjects?.data ?? []).filter(
    (s) => !teacher.deptId || s.deptId === teacher.deptId
  )

  const toggleSubject = (id: string) => {
    setSelectedSubjects((prev) =>
      prev.includes(id) ? prev.filter((s) => s !== id) : [...prev, id]
    )
  }

  const handleOpenChange = (open: boolean) => {
    if (!open) {
      reset({
        firstName:     teacher.firstName,
        lastName:      teacher.lastName,
        phone:         teacher.phone         ?? '',
        address:       teacher.address       ?? '',
        qualification: teacher.qualification ?? '',
        designation:   teacher.designation   ?? '',
        level:         (teacher.level as TeacherLevel) ?? '',
      })
      setSelectedSubjects(teacher.subjectIds ?? [])
      mutation.reset()
    }
  }

  const onSubmit = (data: EditForm) => {
    mutation.mutate({
      firstName:     data.firstName,
      lastName:      data.lastName,
      phone:         data.phone?.trim()         || undefined,
      address:       data.address?.trim()       || undefined,
      qualification: data.qualification?.trim() || undefined,
      designation:   data.designation?.trim()   || undefined,
      level:         data.level                 || undefined,
      subjectIds:    selectedSubjects,
    })
  }

  const errorMessage = (mutation.error as any)
    ?.response?.data?.message ?? 'Failed to update teacher'

  const hasChanges = isDirty ||
    JSON.stringify(selectedSubjects.sort()) !==
    JSON.stringify((teacher.subjectIds ?? []).sort())

  return (
    <Dialog onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm" className="gap-2">
          <Pencil className="size-4" />
          Edit
        </Button>
      </DialogTrigger>

      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Edit teacher</DialogTitle>
          <DialogDescription>
            Update {teacher.firstName}'s profile details.
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

            {/* First + Last name */}
            <div className="grid grid-cols-2 gap-3">
              <div className="flex flex-col gap-1.5">
                <Label htmlFor="et-firstName">First name</Label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
                  <Input
                    id="et-firstName"
                    className="pl-9"
                    {...register('firstName', { required: 'Required', minLength: { value: 2, message: 'Too short' } })}
                  />
                </div>
                {errors.firstName && (
                  <p className="text-xs text-destructive">{errors.firstName.message}</p>
                )}
              </div>

              <div className="flex flex-col gap-1.5">
                <Label htmlFor="et-lastName">Last name</Label>
                <Input
                  id="et-lastName"
                  {...register('lastName', { required: 'Required', minLength: { value: 2, message: 'Too short' } })}
                />
                {errors.lastName && (
                  <p className="text-xs text-destructive">{errors.lastName.message}</p>
                )}
              </div>
            </div>

            {/* Level + Designation */}
            <div className="grid grid-cols-2 gap-3">
              <div className="flex flex-col gap-1.5">
                <Label htmlFor="et-level">Teaching level</Label>
                <select
                  id="et-level"
                  className="h-10 w-full rounded-md border border-input bg-background px-3 text-sm"
                  {...register('level')}
                >
                  <option value="">Select level</option>
                  {Object.entries(TEACHER_LEVEL_LABELS).map(([v, l]) => (
                    <option key={v} value={v}>{l}</option>
                  ))}
                </select>
              </div>

              <div className="flex flex-col gap-1.5">
                <Label htmlFor="et-designation">
                  Designation
                  <span className="text-muted-foreground ml-1">(optional)</span>
                </Label>
                <div className="relative">
                  <Briefcase className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
                  <Input
                    id="et-designation"
                    placeholder="Senior Lecturer"
                    className="pl-9"
                    {...register('designation')}
                  />
                </div>
              </div>
            </div>

            {/* Qualification */}
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="et-qualification">
                Qualification
                <span className="text-muted-foreground ml-1">(optional)</span>
              </Label>
              <div className="relative">
                <GraduationCap className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
                <Input
                  id="et-qualification"
                  placeholder="M.Sc Computer Science"
                  className="pl-9"
                  {...register('qualification')}
                />
              </div>
            </div>

            {/* Phone */}
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="et-phone">
                Phone
                <span className="text-muted-foreground ml-1">(optional)</span>
              </Label>
              <div className="relative">
                <Phone className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
                <Input
                  id="et-phone"
                  type="tel"
                  className="pl-9"
                  {...register('phone')}
                />
              </div>
            </div>

            {/* Address */}
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="et-address">
                Address
                <span className="text-muted-foreground ml-1">(optional)</span>
              </Label>
              <div className="relative">
                <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
                <Input
                  id="et-address"
                  className="pl-9"
                  {...register('address')}
                />
              </div>
            </div>

            {/* Subjects — filtered by teacher's department */}
            <div className="flex flex-col gap-1.5">
              <div className="flex items-center justify-between">
                <Label>
                  Subjects
                  {teacher.deptId && (
                    <span className="text-muted-foreground ml-1 text-xs font-normal">
                      ({depts?.data.find((d) => d.id === teacher.deptId)?.deptName ?? 'Department'})
                    </span>
                  )}
                </Label>
                {selectedSubjects.length > 0 && (
                  <Badge variant="secondary" className="text-xs">
                    {selectedSubjects.length} selected
                  </Badge>
                )}
              </div>

              {!teacher.deptId ? (
                <p className="text-xs text-muted-foreground p-3 border rounded-lg text-center">
                  Assign a department first to select subjects.
                </p>
              ) : !deptSubjects.length ? (
                <p className="text-xs text-muted-foreground p-3 border rounded-lg text-center">
                  No subjects found in this department.
                </p>
              ) : (
                <div className="border rounded-lg overflow-hidden">
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
                          {isSelected && (
                            <Check className="size-3 shrink-0 text-primary ml-1" />
                          )}
                        </button>
                      )
                    })}
                  </div>
                </div>
              )}

              {selectedSubjects.length > 0 && (
                <div className="flex flex-wrap gap-1">
                  {selectedSubjects.map((id) => {
                    const s = subjects?.data.find((s) => s.id === id)
                    return (
                      <span
                        key={id}
                        className="inline-flex items-center gap-1 text-xs bg-primary/10 text-primary px-2 py-0.5 rounded-md"
                      >
                        {s?.subjectName ?? id}
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
                  disabled={mutation.isPending || !hasChanges}
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