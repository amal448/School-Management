import { useState }      from 'react'
import { ColumnDef }     from '@tanstack/react-table'
import { Button }        from '@/components/ui/button'
import { Badge }         from '@/components/ui/badge'
import { ArrowUpDown, MoreHorizontal, Check, X, Pencil } from 'lucide-react'
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem,
  DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { ClassResponse, UpdateClassInput } from '@/types/class.types'
import { useDeleteClass, useUpdateClass }  from '@/hooks/class/useClasses'
import { useSubjects }    from '@/hooks/subject/useSubjects'
import { CrudDialog }     from '@/components/shared/CrudDialog'
import { Label }          from '@/components/ui/label'
import { useForm }        from 'react-hook-form'
import {
  CLASS_GROUPS,
  SECTIONS,
  getGroupLabel,
} from '@/constants/class.constants'

// ── Edit dialog ────────────────────────────────────────
const EditClassDialog = ({ cls }: { cls: ClassResponse }) => {
  const updateMutation = useUpdateClass(cls.id)
  const { data: subjects } = useSubjects({ limit: 100 })

  // Pre-select subjects already allocated to this class
  const [selectedSubjects, setSelectedSubjects] = useState<string[]>(
    cls.subjectAllocations.map((a) => a.subjectId)
  )

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    reset,
    formState: { errors },
  } = useForm<UpdateClassInput>({
    defaultValues: {
      className: cls.className,
      section:   cls.section,
    },
  })

  const selectedClass   = watch('className')
  const selectedSection = watch('section')

  const toggleSubject = (subjectId: string) => {
    setSelectedSubjects((prev) =>
      prev.includes(subjectId)
        ? prev.filter((id) => id !== subjectId)
        : [...prev, subjectId]
    )
  }

  const onSubmit = (data: UpdateClassInput) => {
    updateMutation.mutate({
      className: data.className,
      section:   data.section,
      // Preserve existing teacherIds for already-allocated subjects
      // For newly added subjects, teacherId is undefined (assigned later)
      subjectAllocations: selectedSubjects.map((subjectId) => {
        const existing = cls.subjectAllocations.find(
          (a) => a.subjectId === subjectId
        )
        return {
          subjectId,
          teacherId: existing?.teacherId,
        }
      }),
    } as any)
  }

  const handleOpenChange = (open: boolean) => {
    if (!open) {
      reset({ className: cls.className, section: cls.section })
      setSelectedSubjects(cls.subjectAllocations.map((a) => a.subjectId))
      updateMutation.reset()
    }
  }

  return (
    <CrudDialog
      trigger={
        <Button variant="outline" size="sm" className="gap-1.5">
          <Pencil className="size-3.5" />
          Edit
        </Button>
      }
      title="Edit class"
      description={`Update Class ${cls.className}-${cls.section}.`}
      isPending={updateMutation.isPending}
      isSuccess={updateMutation.isSuccess}
      isError={updateMutation.isError}
      errorMessage={
        (updateMutation.error as any)?.response?.data?.message ?? 'Failed to update'
      }
      submitLabel="Save changes"
      isDirty={true}
      onSubmit={handleSubmit(onSubmit)}
      onOpenChange={handleOpenChange}
    >

      {/* ── Class number ──────────────────────────── */}
      <div className="flex flex-col gap-2">
        <Label>
          Class
          {selectedClass && (
            <span className="ml-2 text-xs font-normal text-muted-foreground">
              {getGroupLabel(selectedClass)} school
            </span>
          )}
        </Label>

        <div className="flex flex-col gap-3">
          {CLASS_GROUPS.map((group) => (
            <div key={group.label}>
              <p className="text-xs text-muted-foreground mb-1.5">
                {group.label}
              </p>
              <div className="flex gap-2 flex-wrap">
                {group.classes.map((c) => (
                  <button
                    key={c}
                    type="button"
                    onClick={() => setValue('className', c, { shouldDirty: true })}
                    className={`
                      w-10 h-10 rounded-lg text-sm font-medium border transition-all
                      ${selectedClass === c
                        ? 'bg-primary text-primary-foreground border-primary'
                        : 'bg-background border-border hover:border-primary/50 hover:bg-muted'
                      }
                    `}
                  >
                    {c}
                  </button>
                ))}
              </div>
            </div>
          ))}
        </div>

        <input type="hidden" {...register('className', { required: true })} />
        {errors.className && (
          <p className="text-xs text-destructive">Please select a class</p>
        )}
      </div>

      {/* ── Section ──────────────────────────────── */}
      <div className="flex flex-col gap-2">
        <Label>Section</Label>
        <div className="flex gap-2 flex-wrap">
          {SECTIONS.map((sec) => (
            <button
              key={sec}
              type="button"
              onClick={() => setValue('section', sec, { shouldDirty: true })}
              className={`
                w-10 h-10 rounded-lg text-sm font-medium border transition-all
                ${selectedSection === sec
                  ? 'bg-primary text-primary-foreground border-primary'
                  : 'bg-background border-border hover:border-primary/50 hover:bg-muted'
                }
              `}
            >
              {sec}
            </button>
          ))}
        </div>
        <input type="hidden" {...register('section', { required: true })} />
        {errors.section && (
          <p className="text-xs text-destructive">Please select a section</p>
        )}
      </div>

      {/* ── Subject selection ──────────────────────── */}
      <div className="flex flex-col gap-2">
        <div className="flex items-center justify-between">
          <Label>Subjects</Label>
          {selectedSubjects.length > 0 && (
            <Badge variant="secondary" className="text-xs">
              {selectedSubjects.length} selected
            </Badge>
          )}
        </div>

        <div className="border rounded-lg max-h-44 overflow-y-auto border-border">
          {!subjects?.data.length ? (
            <div className="p-4 text-center text-sm text-muted-foreground">
              No subjects found.
            </div>
          ) : (
            subjects.data.map((subject) => {
              const isSelected = selectedSubjects.includes(subject.id)
              const hasTeacher = cls.subjectAllocations.find(
                (a) => a.subjectId === subject.id
              )?.teacherId

              return (
                <button
                  key={subject.id}
                  type="button"
                  onClick={() => toggleSubject(subject.id)}
                  className={`
                    w-full flex items-center justify-between
                    px-3 py-2.5 text-sm text-left transition-colors
                    border-b last:border-b-0 border-border
                    ${isSelected
                      ? 'bg-primary/5 text-primary'
                      : 'hover:bg-muted/60 text-foreground'
                    }
                  `}
                >
                  <div className="flex flex-col gap-0.5">
                    <span>{subject.subjectName}</span>
                    {isSelected && hasTeacher && (
                      <span className="text-xs text-muted-foreground">
                        Teacher assigned
                      </span>
                    )}
                  </div>
                  {isSelected && (
                    <Check className="size-3.5 shrink-0 text-primary" />
                  )}
                </button>
              )
            })
          )}
        </div>

        {/* Selected pills */}
        {selectedSubjects.length > 0 && (
          <div className="flex flex-wrap gap-1.5">
            {selectedSubjects.map((id) => {
              const subject = subjects?.data.find((s) => s.id === id)
              return (
                <span
                  key={id}
                  className="inline-flex items-center gap-1 text-xs bg-primary/10 text-primary px-2 py-1 rounded-md font-medium"
                >
                  {subject?.subjectName}
                  <button
                    type="button"
                    onClick={() => toggleSubject(id)}
                    className="hover:text-destructive transition-colors ml-0.5"
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

// ── Actions cell ───────────────────────────────────────
const ActionsCell = ({ cls }: { cls: ClassResponse }) => {
  const deleteMutation = useDeleteClass()

  return (
    <div className="flex items-center gap-2">
      <EditClassDialog cls={cls} />
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="icon" className="size-8">
            <MoreHorizontal className="size-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuLabel>Actions</DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem
            className="text-destructive focus:text-destructive"
            onClick={() => deleteMutation.mutate(cls.id)}
            disabled={deleteMutation.isPending}
          >
            Delete class
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  )
}

// ── Columns ───────────────────────────────────────────
export const classColumns: ColumnDef<ClassResponse>[] = [
  {
    accessorKey: 'className',
    header: ({ column }) => (
      <Button
        variant="ghost"
        size="sm"
        className="-ml-3 gap-1"
        onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
      >
        Class <ArrowUpDown className="size-3.5" />
      </Button>
    ),
    cell: ({ row }) => (
      <div>
        <p className="font-medium">
          Class {row.original.className} — {row.original.section}
        </p>
        <p className="text-xs text-muted-foreground">
          {getGroupLabel(row.original.className)} school
        </p>
      </div>
    ),
  },
  {
    accessorKey: 'subjectAllocations',
    header: 'Subjects',
    cell: ({ row }) => (
      <Badge variant="secondary">
        {row.original.subjectAllocations.length} subjects
      </Badge>
    ),
  },
  {
    accessorKey: 'classTeacherId',
    header: 'Class Teacher',
    cell: ({ row }) => (
      <span className="text-sm text-muted-foreground">
        {row.original.classTeacherId ? 'Assigned' : 'Not assigned'}
      </span>
    ),
  },
  {
    id:           'actions',
    enableHiding: false,
    cell: ({ row }) => <ActionsCell cls={row.original} />,
  },
]