// src/pages/shared/TeacherProfilePage.tsx

import { useParams, useNavigate }  from 'react-router-dom'
import { useAuthStore }            from '@/store/auth.store'
import { Badge }                   from '@/components/ui/badge'
import { Button }                  from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import {
  ArrowLeft, Mail, Phone, MapPin, Calendar,
  GraduationCap, Building2, Briefcase, Clock,
  ShieldAlert, ShieldCheck, UserX, UserCheck,
} from 'lucide-react'
import { TeacherResponse }         from '@/types/teacher.types'
import { EditTeacherDialog }       from '@/components/shared/teacher/EditTeacherDialog'
import {
  useTeacher,
  useUpdateTeacher,
  useDeactivateTeacher,
  useReactivateTeacher,
} from '@/hooks/teacher/useTeachers'

// ── Avatar ─────────────────────────────────────────────
const Avatar = ({ name }: { name: string }) => {
  const initials = name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .slice(0, 2)
    .toUpperCase()

  return (
    <div className="size-20 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
      <span className="text-2xl font-semibold text-primary">{initials}</span>
    </div>
  )
}

// ── Status badge ───────────────────────────────────────
const StatusBadge = ({ teacher }: { teacher: TeacherResponse }) => {
  if (!teacher.isActive)   return <Badge variant="secondary">Inactive</Badge>
  if (teacher.isFirstTime) return <Badge variant="outline">Pending Setup</Badge>
  if (!teacher.isVerified) return <Badge variant="outline">Unverified</Badge>
  return <Badge variant="default">Active</Badge>
}

// ── Info row ───────────────────────────────────────────
const InfoRow = ({
  icon: Icon, label, value,
}: {
  icon: React.ElementType
  label: string
  value?: string | null
}) => (
  <div className="flex items-start gap-3 py-3">
    <div className="size-8 rounded-md bg-muted flex items-center justify-center shrink-0 mt-0.5">
      <Icon className="size-4 text-muted-foreground" />
    </div>
    <div className="flex flex-col gap-0.5 min-w-0">
      <p className="text-xs text-muted-foreground">{label}</p>
      <p className="text-sm font-medium truncate">{value ?? '—'}</p>
    </div>
  </div>
)

// ── Skeleton ───────────────────────────────────────────
const ProfileSkeleton = () => (
  <div className="flex flex-col gap-6 animate-pulse">
    <div className="h-8 w-32 bg-muted rounded" />
    <div className="h-40 bg-muted rounded-xl" />
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
      {[...Array(4)].map((_, i) => (
        <div key={i} className="h-40 bg-muted rounded-xl" />
      ))}
    </div>
  </div>
)

// ── Page ──────────────────────────────────────────────
export default function TeacherProfilePage() {
  const { id }   = useParams<{ id: string }>()
  const navigate = useNavigate()
  const { user } = useAuthStore()

  // ── Data ──────────────────────────────────────────
  const { data: teacher, isLoading, isError } = useTeacher(id ?? '')

  // ── Mutations defined in page ─────────────────────
  const updateMutation     = useUpdateTeacher(id ?? '')
  const deactivateMutation = useDeactivateTeacher()
  const reactivateMutation = useReactivateTeacher()

  const isAdmin   = user?.role === 'ADMIN'
  const isManager = user?.role === 'MANAGER'
  const canEdit   = isAdmin || isManager

  const handleBack = () => navigate(-1)

  const handleDeactivate = () => {
    if (!teacher) return
    deactivateMutation.mutate(teacher.id, {
      onSuccess: () => navigate(-1),
    })
  }

  const handleReactivate = () => {
    if (!teacher) return
    reactivateMutation.mutate(teacher.id)
  }

  if (isLoading) return (
    <div className="p-6 w-full mx-auto"><ProfileSkeleton /></div>
  )

  if (isError || !teacher) return (
    <div className="p-6 w-full mx-auto flex flex-col items-center justify-center h-64 gap-3">
      <UserX className="size-10 text-muted-foreground" />
      <p className="text-muted-foreground text-sm">Teacher not found</p>
      <Button variant="outline" size="sm" onClick={handleBack}>Go back</Button>
    </div>
  )

  return (
    <div className="p-6 w-full mx-auto flex flex-col gap-6">

      <Button
        variant="ghost"
        size="sm"
        className="w-fit gap-2 -ml-2 text-muted-foreground hover:text-foreground"
        onClick={handleBack}
      >
        <ArrowLeft className="size-4" />
        Back
      </Button>

      {/* Header card */}
      <Card>
        <CardContent className="p-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-5">

            <Avatar name={teacher.fullName} />

            <div className="flex flex-col gap-2 flex-1 min-w-0">
              <div className="flex flex-wrap items-center gap-2">
                <h1 className="text-xl font-semibold truncate">{teacher.fullName}</h1>
                <StatusBadge teacher={teacher} />
              </div>
              <p className="text-sm text-muted-foreground">
                {teacher.designation ?? 'Teacher'}
                {teacher.deptId && (
                  <span className="text-muted-foreground/60"> · Department assigned</span>
                )}
              </p>
              <p className="text-xs text-muted-foreground">
                Member since {new Date(teacher.createdAt).toLocaleDateString('en-US', {
                  year: 'numeric', month: 'long', day: 'numeric',
                })}
              </p>
            </div>

            {/* Actions */}
            <div className="flex gap-2 flex-wrap shrink-0">

              {/* Edit — admin and manager can edit */}
              {canEdit && (
                <EditTeacherDialog
                  teacher={teacher}
                  mutation={updateMutation}
                />
              )}

              {/* Reactivate — if inactive */}
              {isAdmin && !teacher.isActive && (
                <Button
                  variant="outline"
                  size="sm"
                  className="gap-2"
                  onClick={handleReactivate}
                  disabled={reactivateMutation.isPending}
                >
                  <UserCheck className="size-4" />
                  {reactivateMutation.isPending ? 'Activating...' : 'Reactivate'}
                </Button>
              )}

              {/* Deactivate — admin only, only if active */}
              {isAdmin && teacher.isActive && (
                <Button
                  variant="outline"
                  size="sm"
                  className="gap-2 text-destructive border-destructive/30 hover:bg-destructive/5"
                  onClick={handleDeactivate}
                  disabled={deactivateMutation.isPending}
                >
                  <ShieldAlert className="size-4" />
                  {deactivateMutation.isPending ? 'Deactivating...' : 'Deactivate'}
                </Button>
              )}
            </div>

          </div>
        </CardContent>
      </Card>

      {/* Info grid */}
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
            <InfoRow icon={Building2}     label="Department"    value={teacher.deptId ?? 'Not assigned'} />
            <InfoRow icon={Calendar}      label="Hire date"     value={teacher.hireDate
              ? new Date(teacher.hireDate).toLocaleDateString()
              : undefined}
            />
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-0 pt-5 px-6">
            <CardTitle className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
              Personal
            </CardTitle>
          </CardHeader>
          <CardContent className="px-6 pb-4 divide-y divide-border">
            <InfoRow icon={Calendar}      label="Date of birth" value={teacher.dob
              ? new Date(teacher.dob).toLocaleDateString()
              : undefined}
            />
            <InfoRow icon={GraduationCap} label="Gender" value={teacher.gender} />
          </CardContent>
        </Card>

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
              value={teacher.lastLogin
                ? new Date(teacher.lastLogin).toLocaleString()
                : 'Never logged in'}
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