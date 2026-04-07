import { ClassResponse } from '@/types/class.types'
import { Card, CardContent } from '@/components/ui/card'
import {  ChevronRight, Star } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { useSubjects } from '@/hooks/subject/useSubjects'
import { Badge } from '@/components/ui/badge' 

// ── Class card ─────────────────────────────────────────
export const ClassCard = ({
  cls,
  teacherId,
  type,
}: {
  cls: ClassResponse
  teacherId: string
  type: 'class-teacher' | 'subject-teacher'
}) => {
  const navigate = useNavigate()

  const { data: subjects } = useSubjects({ limit: 100 })

  // Subjects this teacher handles in this class
  const mySubjects = cls.subjectAllocations
    .filter((a) => a.teacherId === teacherId)
    .map((a) => subjects?.data.find((s) => s.id === a.subjectId)?.subjectName)
    .filter(Boolean)

  return (
    <Card
      className="cursor-pointer hover:border-primary/40 transition-colors"
      onClick={() => navigate(`/teacher/classes/${cls.id}`)}
    >
      <CardContent className="p-4 flex items-center justify-between gap-3">
        <div className="flex items-center gap-3 min-w-0">
          <div className={`
            size-10 rounded-lg flex items-center justify-center shrink-0 font-medium text-sm
            ${type === 'class-teacher'
              ? 'bg-primary/10 text-primary'
              : 'bg-secondary text-muted-foreground'
            }
          `}>
            {cls.grade}
          </div>
          <div className="flex flex-col gap-0.5 min-w-0">
            <div className="flex items-center gap-2">
              <p className="text-sm font-medium">
                Grade {cls.grade}-{cls.section}
              </p>
              {type === 'class-teacher' && (
                <Badge variant="secondary" className="text-xs py-0">
                  <Star className="size-2.5 mr-1" />
                  Class teacher
                </Badge>
              )}
            </div>
          {mySubjects.length > 0 && (
              <div className="flex gap-1 flex-wrap">
                {mySubjects.map((name) => (
                  <span
                    key={name}
                    className="text-xs bg-primary/10 text-primary px-2 py-0.5 rounded-md"
                  >
                    {name}
                  </span>
                ))}
              </div>
            )}
          </div>
        </div>
        <ChevronRight className="size-4 text-muted-foreground shrink-0" />
      </CardContent>
    </Card>
  )
}
