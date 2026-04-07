import { useNavigate }       from 'react-router-dom'
import { Card, CardContent } from '@/components/ui/card'
import { Badge }             from '@/components/ui/badge'
import { Button }            from '@/components/ui/button'
import {
  ChevronRight, Star, BookOpen,
  GraduationCap, Users,
} from 'lucide-react'
import { useMyClasses, useMyProfile } from '@/hooks/teacher/useTeachers'
import { useSubjects }                from '@/hooks/subject/useSubjects'
import { useStudentsByClass }         from '@/hooks/student/useStudents'
import { ClassResponse }              from '@/types/class.types'

// ── Class card ─────────────────────────────────────────
const ClassCard = ({
  cls,
  teacherId,
  isClassTeacher,
}: {
  cls:            ClassResponse
  teacherId:      string
  isClassTeacher: boolean
}) => {
  const navigate           = useNavigate()
  const { data: subjects } = useSubjects({ limit: 100 })

  const mySubjects = cls.subjectAllocations
    .filter((a) => a.teacherId === teacherId)
    .map((a) => subjects?.data.find((s) => s.id === a.subjectId)?.subjectName)
    .filter(Boolean) as string[]

  return (
    <Card
      className="cursor-pointer hover:border-primary/40 transition-colors"
      onClick={() => navigate(`/teacher/classes/${cls.id}`)}
    >
      <CardContent className="p-5">
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-start gap-3 min-w-0">

            {/* Grade badge */}
            <div className={`
              size-12 rounded-xl flex items-center justify-center
              shrink-0 font-semibold text-base
              ${isClassTeacher
                ? 'bg-primary/10 text-primary'
                : 'bg-secondary text-muted-foreground'
              }
            `}>
              {cls.grade}
            </div>

            <div className="flex flex-col gap-1.5 min-w-0">
              <div className="flex items-center gap-2 flex-wrap">
                <p className="font-medium">
                  Grade {cls.grade} — {cls.section}
                </p>
                {isClassTeacher && (
                  <Badge variant="secondary" className="text-xs gap-1">
                    <Star className="size-2.5" />
                    Class teacher
                  </Badge>
                )}
              </div>

              {/* My subjects in this class */}
              {mySubjects.length > 0 && (
                <div className="flex gap-1 flex-wrap">
                  {mySubjects.map((name) => (
                    <span
                      key={name}
                      className="text-xs bg-primary/8 text-primary px-2 py-0.5 rounded-md border border-primary/15"
                    >
                      {name}
                    </span>
                  ))}
                </div>
              )}
            </div>
          </div>

          <ChevronRight className="size-4 text-muted-foreground shrink-0 mt-1" />
        </div>
      </CardContent>
    </Card>
  )
}

// ── Skeleton ───────────────────────────────────────────
const Skeleton = () => (
  <div className="flex flex-col gap-6 animate-pulse p-6">
    <div className="h-8 w-48 bg-muted rounded" />
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
      {[...Array(4)].map((_, i) => (
        <div key={i} className="h-24 bg-muted rounded-xl" />
      ))}
    </div>
  </div>
)

// ── Page ──────────────────────────────────────────────
export default function TeacherClassesPage() {
  const { data: profile }                = useMyProfile()
  const { data: classes, isLoading }     = useMyClasses()

  const teacherId = profile?.id ?? ''

  const classTeacherClasses = (classes ?? []).filter(
    (c) => c.classTeacherId === teacherId
  )

  const subjectOnlyClasses = (classes ?? []).filter(
    (c) =>
      c.classTeacherId !== teacherId &&
      c.subjectAllocations.some((a) => a.teacherId === teacherId)
  )

  if (isLoading) return <Skeleton />

  return (
    <div className="p-6 flex flex-col gap-8">

      <div>
        <h1 className="text-lg font-medium">My classes</h1>
        <p className="text-xs text-muted-foreground mt-0.5">
          {(classes ?? []).length} total classes
        </p>
      </div>

      {/* Classes I manage — class teacher */}
      {classTeacherClasses.length > 0 && (
        <div className="flex flex-col gap-3">
          <div className="flex items-center gap-2">
            <GraduationCap className="size-4 text-muted-foreground" />
            <h2 className="text-sm font-medium">Classes I manage</h2>
            <Badge variant="secondary" className="text-xs">Class teacher</Badge>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {classTeacherClasses
              .sort((a, b) => Number(a.grade) - Number(b.grade))
              .map((cls) => (
                <ClassCard
                  key={cls.id}
                  cls={cls}
                  teacherId={teacherId}
                  isClassTeacher={true}
                />
              ))}
          </div>
        </div>
      )}

      {/* Classes I teach — subject teacher only */}
      {subjectOnlyClasses.length > 0 && (
        <div className="flex flex-col gap-3">
          <div className="flex items-center gap-2">
            <BookOpen className="size-4 text-muted-foreground" />
            <h2 className="text-sm font-medium">Classes I teach</h2>
            <Badge variant="outline" className="text-xs">Subject teacher</Badge>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {subjectOnlyClasses
              .sort((a, b) => Number(a.grade) - Number(b.grade))
              .map((cls) => (
                <ClassCard
                  key={cls.id}
                  cls={cls}
                  teacherId={teacherId}
                  isClassTeacher={false}
                />
              ))}
          </div>
        </div>
      )}

      {/* No classes */}
      {!classes?.length && (
        <div className="p-12 text-center text-sm text-muted-foreground border border-dashed rounded-xl">
          No classes assigned yet. Contact your manager.
        </div>
      )}

    </div>
  )
}