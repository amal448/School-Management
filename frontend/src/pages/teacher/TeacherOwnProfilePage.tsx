// src/pages/teacher/TeacherOwnProfilePage.tsx

import { useNavigate }         from 'react-router-dom'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button }              from '@/components/ui/button'
import {
  Mail, Phone, MapPin, Calendar,
  GraduationCap, Building2, Briefcase,
  ShieldAlert, ShieldCheck, Clock,
} from 'lucide-react'
import { useMyProfile, useUpdateTeacher } from '@/hooks/teacher/useTeachers'
import { EditTeacherDialog }   from '@/components/shared/teacher/EditTeacherDialog'
import { InfoRow }             from '@/components/shared/InfoRow'
import { Avatar }              from '@/components/shared/Avatar'
import { TeacherStatusBadge }  from '@/components/shared/StatusBadge'
import { useSubjects }         from '@/hooks/subject/useSubjects'
import { useDepartments }      from '@/hooks/department/useDepartments'
import { TEACHER_LEVEL_LABELS } from '@/types/teacher.types'

export default function TeacherOwnProfilePage() {
  const navigate       = useNavigate()
  const { data: teacher, isLoading } = useMyProfile()
  const { data: subjects }           = useSubjects({ limit: 100 })
  const { data: depts }              = useDepartments()

  // Teacher can edit their own profile
  const updateMutation = useUpdateTeacher(teacher?.id ?? '')

  const deptName = depts?.data.find(
    (d) => d.id === teacher?.deptId
  )?.deptName

  const mySubjects = (teacher?.subjectIds ?? [])
    .map((id) => subjects?.data.find((s) => s.id === id)?.subjectName)
    .filter(Boolean) as string[]

  if (isLoading) return (
    <div className="p-6 flex flex-col gap-4 animate-pulse">
      <div className="h-32 bg-muted rounded-xl" />
      <div className="grid grid-cols-2 gap-4">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="h-40 bg-muted rounded-xl" />
        ))}
      </div>
    </div>
  )

  if (!teacher) return (
    <div className="p-6 flex flex-col items-center justify-center h-64 gap-3">
      <p className="text-sm text-muted-foreground">Could not load profile.</p>
      <Button variant="outline" size="sm" onClick={() => navigate(-1)}>
        Go back
      </Button>
    </div>
  )

  return (
    <div className="p-6 flex flex-col gap-6">

      <h1 className="text-lg font-medium">My profile</h1>

      {/* ── Header ── */}
      <Card>
        <CardContent className="p-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-5">
            <Avatar name={teacher.fullName} size="lg" />

            <div className="flex flex-col gap-2 flex-1 min-w-0">
              <div className="flex flex-wrap items-center gap-2">
                <h2 className="text-xl font-medium truncate">
                  {teacher.fullName}
                </h2>
                <TeacherStatusBadge teacher={teacher} />
              </div>
              <p className="text-sm text-muted-foreground">
                {teacher.designation || 'Teacher'}
                {deptName && (
                  <span className="text-muted-foreground/60"> · {deptName}</span>
                )}
              </p>
              {teacher.level && (
                <p className="text-xs text-muted-foreground">
                  {TEACHER_LEVEL_LABELS[teacher.level]}
                </p>
              )}
              <p className="text-xs text-muted-foreground">
                Member since {new Date(teacher.createdAt).toLocaleDateString(
                  'en-US', { year: 'numeric', month: 'long', day: 'numeric' }
                )}
              </p>
            </div>

            {/* Teacher can edit their own profile */}
            <EditTeacherDialog
              teacher={teacher}
              mutation={updateMutation}
            />
          </div>
        </CardContent>
      </Card>

      {/* ── Info grid ── */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">

        <Card>
          <CardHeader className="pb-0 pt-5 px-6">
            <CardTitle className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
              Contact
            </CardTitle>
          </CardHeader>
          <CardContent className="px-6 pb-4 divide-y divide-border">
            <InfoRow icon={Mail}   label="Email"   value={teacher.email} />
            <InfoRow icon={Phone}  label="Phone"   value={teacher.phone} />
            <InfoRow icon={MapPin} label="Address" value={teacher.address} />
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-0 pt-5 px-6">
            <CardTitle className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
              Professional
            </CardTitle>
          </CardHeader>
          <CardContent className="px-6 pb-4 divide-y divide-border">
            <InfoRow icon={Briefcase}     label="Designation"   value={teacher.designation} />
            <InfoRow icon={GraduationCap} label="Qualification" value={teacher.qualification} />
            <InfoRow icon={Building2}     label="Department"    value={deptName ?? 'Not assigned'} />
            <InfoRow icon={Calendar}      label="Hire date"     value={
              teacher.hireDate
                ? new Date(teacher.hireDate).toLocaleDateString()
                : undefined
            } />
          </CardContent>
        </Card>

        {/* Subjects I teach */}
        {mySubjects.length > 0 && (
          <Card>
            <CardHeader className="pb-0 pt-5 px-6">
              <CardTitle className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                Subjects I teach
              </CardTitle>
            </CardHeader>
            <CardContent className="px-6 pb-4 pt-3">
              <div className="flex flex-wrap gap-2">
                {mySubjects.map((name) => (
                  <span
                    key={name}
                    className="text-xs bg-primary/10 text-primary px-2.5 py-1 rounded-md"
                  >
                    {name}
                  </span>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        <Card>
          <CardHeader className="pb-0 pt-5 px-6">
            <CardTitle className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
              Account
            </CardTitle>
          </CardHeader>
          <CardContent className="px-6 pb-4 divide-y divide-border">
            <InfoRow
              icon={Clock}
              label="Last login"
              value={
                teacher.lastLogin
                  ? new Date(teacher.lastLogin).toLocaleString()
                  : 'Never logged in'
              }
            />
            <InfoRow
              icon={teacher.isVerified ? ShieldCheck : ShieldAlert}
              label="Verification"
              value={teacher.isVerified ? 'Verified' : 'Not verified'}
            />
            <InfoRow
              icon={Calendar}
              label="Account created"
              value={new Date(teacher.createdAt).toLocaleDateString()}
            />
          </CardContent>
        </Card>

      </div>
    </div>
  )
}