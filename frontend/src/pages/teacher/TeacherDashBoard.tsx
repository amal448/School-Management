import { useNavigate } from 'react-router-dom'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { GraduationCap, BookOpen, ChevronRight, AlertCircle, User } from 'lucide-react'
import { useMyProfile, useMyClasses } from '@/hooks/teacher/useTeachers'
import { useMyPendingMarks } from '@/hooks/exam/useExams'
import { Avatar } from '@/components/shared/Avatar'
import { StatCard } from '@/components/shared/class/StatCard'
import { getGreeting } from '@/components/shared/GetGreeting'
import { ClassCard } from '@/components/teacher/ClassCard'
import { PendingCard } from '@/components/teacher/PendingCard'


// ── Page ──────────────────────────────────────────────
export default function TeacherDashboard() {
  const navigate = useNavigate()

  const { data: profile } = useMyProfile()
  const { data: classes } = useMyClasses()
  const { data: pending } = useMyPendingMarks()

  const teacherId = profile?.id ?? ''

  // Split classes by role
  const classTeacherClasses = (classes ?? []).filter(
    (c) => c.classTeacherId === teacherId
  )
  const subjectOnlyClasses = (classes ?? []).filter(
    (c) =>
      c.classTeacherId !== teacherId &&
      c.subjectAllocations.some((a) => a.teacherId === teacherId)
  )

  // Count total students across class-teacher classes
  const totalSubjects = (classes ?? []).reduce(
    (sum, cls) =>
      sum + cls.subjectAllocations.filter(
        (a) => a.teacherId === teacherId
      ).length,
    0,
  )

  return (
    <div className="p-6 flex flex-col gap-6">

      {/* ── Welcome ── */}
<div className="flex items-center justify-between gap-4 p-5 rounded-xl bg-primary/5 border border-primary/10">
  <div className="flex items-center gap-4">
    {profile && <Avatar name={profile.fullName} size="lg" />}
    <div>
      <p className="text-xs text-muted-foreground">{getGreeting()}</p>
      <h1 className="text-lg font-medium">{profile?.fullName}</h1>
      <p className="text-xs text-muted-foreground mt-0.5">
        {profile?.designation ?? 'Teacher'}
      </p>
    </div>
  </div>

  <div className="flex items-center gap-2 shrink-0">
    {/* Profile link — always visible */}
    <Button
      variant="outline"
      size="sm"
      className="gap-2"
      onClick={() => navigate('/teacher/profile')}
    >
      <User className="size-4" />
      My profile
    </Button>

    {/* Pending marks alert */}
    {(pending?.length ?? 0) > 0 && (
      <Button
        size="sm"
        className="gap-2"
        onClick={() => navigate('/teacher/marks')}
      >
        <AlertCircle className="size-4" />
        {pending!.length} pending
      </Button>
    )}
  </div>
</div>

      {/* ── Stats ── */}
      <div className="grid grid-cols-3 gap-3">
        <StatCard
          label="My classes"
          value={classTeacherClasses.length}
          icon={GraduationCap}
          onClick={() => navigate('/teacher/classes')}   // ← if StatCard supports onClick
        />
        <StatCard
          label="Subject classes"
          value={subjectOnlyClasses.length}
          icon={BookOpen}
        />
        <StatCard
          label="My subjects"
          value={totalSubjects}
          icon={BookOpen}
        />
      </div>

      {/* ── Pending marks ── */}
      {(pending?.length ?? 0) > 0 && (
        <div className="flex flex-col gap-3">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-medium">Pending marks entry</h2>
            <Button
              variant="ghost"
              size="sm"
              className="text-xs gap-1 text-muted-foreground"
              onClick={() => navigate('/teacher/marks')}
            >
              View all <ChevronRight className="size-3.5" />
            </Button>
          </div>
          <div className="flex flex-col gap-2">
            {pending!.slice(0, 3).map((s) => (
              <PendingCard key={s.id} schedule={s} teacherId={teacherId} />
            ))}
          </div>
        </div>
      )}

      {/* ── Class teacher classes ── */}
      {classTeacherClasses.length > 0 && (
        <div className="flex flex-col gap-3">
          <div className="flex items-center gap-2">
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
                  type="class-teacher"
                />
              ))}
          </div>
        </div>
      )}

      {/* ── Subject teacher classes ── */}
      {subjectOnlyClasses.length > 0 && (
        <div className="flex flex-col gap-3">
          <div className="flex items-center gap-2">
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
                  type="subject-teacher"
                />
              ))}
          </div>
        </div>
      )}

      {/* ── No classes ── */}
      {!classes?.length && (
        <div className="p-8 text-center text-sm text-muted-foreground border border-dashed rounded-xl">
          No classes assigned yet.
        </div>
      )}

    </div>
  )
}