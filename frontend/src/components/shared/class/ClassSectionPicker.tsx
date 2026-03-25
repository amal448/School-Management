import { Label } from '@/components/ui/label'
import { CLASS_GROUPS, SECTIONS, getGroupLabel } from '@/constants/class.constants'
import { ClassSectionProps } from '@/types/class.types'



export const ClassSectionPicker = ({selectedClass,selectedSection,onClassChange,onSectionChange,classError,sectionError}: ClassSectionProps) => (
  
  <div className="flex flex-col gap-3">
    <div className="flex flex-col gap-1.5">
      <div className="flex items-center justify-between">
        <Label className={classError ? 'text-destructive' : ''}>Class</Label>
        {selectedClass && (
          <span className="text-xs text-muted-foreground">
            {getGroupLabel(selectedClass)} school
          </span>
        )}
      </div>

      <div className="border rounded-lg p-2 flex flex-col gap-2">
        {CLASS_GROUPS.map((group) => (
          <div key={group.label} className="flex items-center gap-2">
            <span className="text-xs text-muted-foreground w-20 shrink-0">
              {group.label}
            </span>
            <div className="flex gap-1.5 flex-wrap">
              {group.classes.map((cls) => (
                <button
                  key={cls}
                  type="button"
                  onClick={() => onClassChange(cls)}
                  className={`
                    w-9 h-9 rounded-md text-sm font-medium border transition-all
                    ${selectedClass === cls
                      ? 'bg-primary text-primary-foreground border-primary'
                      : 'bg-background border-border hover:border-primary/50 hover:bg-muted'
                    }
                  `}
                >
                  {cls}
                </button>
              ))}
            </div>
          </div>
        ))}
      </div>
      {classError && (
        <p className="text-xs text-destructive">Please select a class</p>
      )}
    </div>

    {/* Section inline */}
    <div className="flex flex-col gap-1.5">
      <Label className={sectionError ? 'text-destructive' : ''}>Section</Label>
      <div className="flex gap-1.5">
        {SECTIONS.map((sec) => (
          <button
            key={sec}
            type="button"
            onClick={() => onSectionChange(sec)}
            className={`
              w-9 h-9 rounded-md text-sm font-medium border transition-all
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
      {sectionError && (
        <p className="text-xs text-destructive">Please select a section</p>
      )}
    </div>

  </div>
)