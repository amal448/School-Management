import { Check, X }  from 'lucide-react'
import { Badge }     from '@/components/ui/badge'
import { Label }     from '@/components/ui/label'
import { SubjectResponse } from '@/types/subject.types'

interface Props {
  subjects:         SubjectResponse[]
  selectedIds:      string[]
  onToggle:         (id: string) => void
  error?:           boolean
  showTeacherHint?: boolean            // for edit dialog
  allocations?:     { subjectId: string; teacherId?: string }[]
}

export const SubjectPicker = ({
  subjects,
  selectedIds,
  onToggle,
  error,
  showTeacherHint = false,
  allocations = [],
}: Props) => (
  <div className="flex flex-col gap-1.5">
    <div className="flex items-center justify-between">
      <Label className={error ? 'text-destructive' : ''}>
        Subjects
        <span className="ml-1 text-xs font-normal text-muted-foreground">
          (required)
        </span>
      </Label>
      {selectedIds.length > 0 && (
        <Badge variant="secondary" className="text-xs">
          {selectedIds.length} selected
        </Badge>
      )}
    </div>

    {/* 2-column grid for compact layout */}
    <div className={`
      border rounded-lg overflow-hidden
      ${error ? 'border-destructive' : 'border-border'}
    `}>
      {!subjects.length ? (
        <p className="p-3 text-center text-sm text-muted-foreground">
          No subjects found. Add subjects first.
        </p>
      ) : (
        <div className="grid grid-cols-2 max-h-40 overflow-y-auto">
          {subjects.map((subject) => {
            const isSelected = selectedIds.includes(subject.id)
            const hasTeacher = allocations.find(
              (a) => a.subjectId === subject.id
            )?.teacherId

            return (
              <button
                key={subject.id}
                type="button"
                onClick={() => onToggle(subject.id)}
                className={`
                  flex items-center justify-between
                  px-3 py-2 text-sm text-left transition-colors
                  border-b border-r border-border last:border-b-0
                  ${isSelected
                    ? 'bg-primary/5 text-primary'
                    : 'hover:bg-muted/60 text-foreground'
                  }
                `}
              >
                <div className="flex flex-col gap-0.5 min-w-0">
                  <span className="truncate text-xs">{subject.subjectName}</span>
                  {showTeacherHint && isSelected && hasTeacher && (
                    <span className="text-xs text-muted-foreground">
                      has teacher
                    </span>
                  )}
                </div>
                {isSelected && (
                  <Check className="size-3 shrink-0 text-primary ml-1" />
                )}
              </button>
            )
          })}
        </div>
      )}
    </div>

    {error && (
      <p className="text-xs text-destructive">
        Select at least one subject
      </p>
    )}

    {/* Selected pills */}
    {selectedIds.length > 0 && (
      <div className="flex flex-wrap gap-1">
        {selectedIds.map((id) => {
          const subject = subjects.find((s) => s.id === id)
          return (
            <span
              key={id}
              className="inline-flex items-center gap-1 text-xs bg-primary/10 text-primary px-2 py-0.5 rounded-md"
            >
              {subject?.subjectName}
              <button
                type="button"
                onClick={() => onToggle(id)}
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
)