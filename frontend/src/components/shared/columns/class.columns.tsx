import { ColumnDef }     from '@tanstack/react-table'
import { Button }        from '@/components/ui/button'
import { Badge }         from '@/components/ui/badge'
import { ArrowUpDown, MoreHorizontal } from 'lucide-react'
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem,
  DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { ClassResponse } from '@/types/class.types'
import { useDeleteClass, useUpdateClass } from '@/hooks/class/useClasses'
import { CrudDialog }    from '@/components/shared/CrudDialog'
import { Input }         from '@/components/ui/input'
import { Label }         from '@/components/ui/label'
import { Pencil }        from 'lucide-react'
import { useForm }       from 'react-hook-form'
import { UpdateClassInput } from '@/types/class.types'

const EditClassDialog = ({ cls }: { cls: ClassResponse }) => {
  const updateMutation = useUpdateClass(cls.id)
  const { register, handleSubmit, reset, formState: { isDirty } } =
    useForm<UpdateClassInput>({
      defaultValues: {
        className:    cls.className,
        section:      cls.section,
        academicYear: cls.academicYear,
      },
    })

  return (
    <CrudDialog
      trigger={<Button variant="outline" size="sm" className="gap-1.5"><Pencil className="size-3.5" />Edit</Button>}
      title="Edit class"
      description={`Update class ${cls.className}-${cls.section}.`}
      isPending={updateMutation.isPending}
      isSuccess={updateMutation.isSuccess}
      isError={updateMutation.isError}
      errorMessage={(updateMutation.error as any)?.response?.data?.message ?? 'Failed'}
      submitLabel="Save changes"
      isDirty={isDirty}
      onSubmit={handleSubmit((data) => updateMutation.mutate(data))}
      onOpenChange={(open) => {
        if (!open) {
          reset({ className: cls.className, section: cls.section, academicYear: cls.academicYear })
          updateMutation.reset()
        }
      }}
    >
      <div className="grid grid-cols-2 gap-3">
        <div className="flex flex-col gap-1.5">
          <Label>Class name</Label>
          <Input {...register('className', { required: true })} />
        </div>
        <div className="flex flex-col gap-1.5">
          <Label>Section</Label>
          <Input {...register('section', { required: true })} />
        </div>
      </div>
      <div className="flex flex-col gap-1.5">
        <Label>Academic year</Label>
        <Input {...register('academicYear', { required: true })} />
      </div>
    </CrudDialog>
  )
}

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

export const classColumns: ColumnDef<ClassResponse>[] = [
  {
    accessorKey: 'className',
    header: ({ column }) => (
      <Button variant="ghost" size="sm" className="-ml-3 gap-1"
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
          {row.original.academicYear}
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
    id: 'actions',
    enableHiding: false,
    cell: ({ row }) => <ActionsCell cls={row.original} />,
  },
]