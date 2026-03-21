import { ColumnDef }       from '@tanstack/react-table'
import { Button }          from '@/components/ui/button'
import { ArrowUpDown, MoreHorizontal } from 'lucide-react'
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem,
  DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { SubjectResponse } from '@/types/subject.types'
import { useDeleteSubject, useUpdateSubject } from '@/hooks/subject/useSubjects'
import { useDepartments }  from '@/hooks/department/useDepartments'
import { CrudDialog }      from '@/components/shared/CrudDialog'
import { Input }           from '@/components/ui/input'
import { Label }           from '@/components/ui/label'
import { Pencil }          from 'lucide-react'
import { useForm }         from 'react-hook-form'
import { UpdateSubjectInput } from '@/types/subject.types'

// Inline edit dialog for subject
const EditSubjectDialog = ({ subject }: { subject: SubjectResponse }) => {
  const { data: depts }  = useDepartments()
  const updateMutation   = useUpdateSubject(subject.id)
  const { register, handleSubmit, reset, formState: { isDirty } } =
    useForm<UpdateSubjectInput>({
      defaultValues: { subjectName: subject.subjectName, deptId: subject.deptId },
    })

  return (
    <CrudDialog
      trigger={<Button variant="outline" size="sm" className="gap-1.5"><Pencil className="size-3.5" />Edit</Button>}
      title="Edit subject"
      description={`Update ${subject.subjectName}.`}
      isPending={updateMutation.isPending}
      isSuccess={updateMutation.isSuccess}
      isError={updateMutation.isError}
      errorMessage={(updateMutation.error as any)?.response?.data?.message ?? 'Failed'}
      submitLabel="Save changes"
      isDirty={isDirty}
      onSubmit={handleSubmit((data) => updateMutation.mutate(data))}
      onOpenChange={(open) => {
        if (!open) {
          reset({ subjectName: subject.subjectName, deptId: subject.deptId })
          updateMutation.reset()
        }
      }}
    >
      <div className="flex flex-col gap-1.5">
        <Label>Subject name</Label>
        <Input {...register('subjectName', { required: true })} />
      </div>
      <div className="flex flex-col gap-1.5">
        <Label>Department</Label>
        <select
          className="h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
          {...register('deptId', { required: true })}
        >
          {depts?.data.map((d) => (
            <option key={d.id} value={d.id}>{d.deptName}</option>
          ))}
        </select>
      </div>
    </CrudDialog>
  )
}

const ActionsCell = ({ subject }: { subject: SubjectResponse }) => {
  const deleteMutation = useDeleteSubject()
  const { data: depts } = useDepartments()

  const deptName = depts?.data.find((d) => d.id === subject.deptId)?.deptName

  return (
    <div className="flex items-center gap-2">
      <EditSubjectDialog subject={subject} />
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
            onClick={() => deleteMutation.mutate(subject.id)}
            disabled={deleteMutation.isPending}
          >
            Delete subject
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  )
}

export const subjectColumns: ColumnDef<SubjectResponse>[] = [
  {
    accessorKey: 'subjectName',
    header: ({ column }) => (
      <Button variant="ghost" size="sm" className="-ml-3 gap-1"
        onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
      >
        Subject <ArrowUpDown className="size-3.5" />
      </Button>
    ),
    cell: ({ row }) => (
      <p className="font-medium">{row.original.subjectName}</p>
    ),
  },
  {
    accessorKey: 'deptId',
    header: 'Department',
    cell: ({ row }) => {
      const { data: depts } = useDepartments()
      const name = depts?.data.find((d) => d.id === row.original.deptId)?.deptName
      return <span className="text-sm text-muted-foreground">{name ?? '—'}</span>
    },
  },
  {
    accessorKey: 'createdAt',
    header: 'Created',
    cell: ({ row }) => (
      <span className="text-sm text-muted-foreground">
        {new Date(row.original.createdAt).toLocaleDateString()}
      </span>
    ),
  },
  {
    id: 'actions',
    enableHiding: false,
    cell: ({ row }) => <ActionsCell subject={row.original} />,
  },
]