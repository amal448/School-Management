import { useParams, useNavigate }    from 'react-router-dom'
import { Badge }                     from '@/components/ui/badge'
import { Button }                    from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import {
  ArrowLeft, Mail, Phone, Clock,
  ShieldAlert, ShieldCheck, UserX, ShieldOff,
} from 'lucide-react'
import { ManagerResponse }           from '@/types/manager.types'
import { EditManagerDialog }         from '@/components/admin/EditManagerDialog'
import {
  useManager,
  useUpdateManager,
  useBlockManager,
  useUnblockManager,
  useDeleteManager,
} from '@/hooks/admin/useManagers'

// ── Sub-components unchanged ──────────────────────────
const Avatar = ({ name }: { name: string }) => {
  const initials = name.split(' ').map((n) => n[0]).join('').slice(0, 2).toUpperCase()
  return (
    <div className="size-20 rounded-full bg-amber-100 dark:bg-amber-900/30 flex items-center justify-center shrink-0">
      <span className="text-2xl font-semibold text-amber-700 dark:text-amber-400">
        {initials}
      </span>
    </div>
  )
}

const StatusBadge = ({ manager }: { manager: ManagerResponse }) => {
  if (manager.isBlocked)   return <Badge variant="destructive">Blocked</Badge>
  if (!manager.isActive)   return <Badge variant="secondary">Inactive</Badge>
  if (manager.isFirstTime) return <Badge variant="outline">Pending Setup</Badge>
  return <Badge variant="default">Active</Badge>
}

const InfoRow = ({
  icon: Icon, label, value,
}: {
  icon: React.ElementType
  label: string
  value?: string | null
}) => (
  <div className="flex items-center gap-3 py-3">
    <div className="size-8 rounded-md bg-muted flex items-center justify-center shrink-0">
      <Icon className="size-4 text-muted-foreground" />
    </div>
    <div className="flex flex-col gap-0.5 min-w-0">
      <p className="text-xs text-muted-foreground">{label}</p>
      <p className="text-sm font-medium truncate">{value ?? '—'}</p>
    </div>
  </div>
)

const FlagRow = ({
  label, active, activeLabel = 'Yes', inactiveLabel = 'No',
}: {
  label: string
  active: boolean
  activeLabel?: string
  inactiveLabel?: string
}) => (
  <div className="flex items-center justify-between py-3">
    <span className="text-sm text-muted-foreground">{label}</span>
    <Badge variant={active ? 'default' : 'secondary'}>
      {active ? activeLabel : inactiveLabel}
    </Badge>
  </div>
)

const ProfileSkeleton = () => (
  <div className="flex flex-col gap-6 animate-pulse">
    <div className="h-8 w-32 bg-muted rounded" />
    <div className="h-40 bg-muted rounded-xl" />
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
      {[...Array(3)].map((_, i) => (
        <div key={i} className="h-40 bg-muted rounded-xl" />
      ))}
    </div>
  </div>
)

// ── Page ──────────────────────────────────────────────
export default function ManagerProfilePage() {
  const { id }   = useParams<{ id: string }>()
  const navigate = useNavigate()

  // ── Data fetching ──────────────────────────────────
  const { data: manager, isLoading, isError } = useManager(id ?? '')

  // ── Mutations defined here, passed to components ───
  const updateMutation  = useUpdateManager(id ?? '')
  const blockMutation   = useBlockManager()
  const unblockMutation = useUnblockManager()
  const deleteMutation  = useDeleteManager()

  const handleBack = () => navigate(-1)

  const handleBlock = () => {
    if (!manager) return
    blockMutation.mutate(manager.id)
  }

  const handleUnblock = () => {
    if (!manager) return
    unblockMutation.mutate(manager.id)
  }

  const handleDeactivate = () => {
    if (!manager) return
    deleteMutation.mutate(manager.id, {
      onSuccess: () => navigate(-1),
    })
  }

  if (isLoading) return (
    <div className="p-6 w-full mx-auto"><ProfileSkeleton /></div>
  )

  if (isError || !manager) return (
    <div className="p-6 w-full mx-auto flex flex-col items-center justify-center h-64 gap-3">
      <UserX className="size-10 text-muted-foreground" />
      <p className="text-muted-foreground text-sm">Manager not found</p>
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

            <Avatar name={manager.fullName} />

            <div className="flex flex-col gap-2 flex-1 min-w-0">
              <div className="flex flex-wrap items-center gap-2">
                <h1 className="text-xl font-semibold">{manager.fullName}</h1>
                <StatusBadge manager={manager} />
              </div>
              <p className="text-sm text-muted-foreground">School Manager</p>
              <p className="text-xs text-muted-foreground">
                Member since {new Date(manager.createdAt).toLocaleDateString('en-US', {
                  year: 'numeric', month: 'long', day: 'numeric',
                })}
              </p>
            </div>

            {/* Actions */}
            <div className="flex gap-2 flex-wrap shrink-0">

              {/* Edit — mutation defined in page, passed to dialog */}
              <EditManagerDialog
                manager={manager}
                mutation={updateMutation}
              />

              {manager.isBlocked ? (
                <Button
                  variant="outline"
                  size="sm"
                  className="gap-2"
                  onClick={handleUnblock}
                  disabled={unblockMutation.isPending}
                >
                  <ShieldCheck className="size-4" />
                  {unblockMutation.isPending ? 'Unblocking...' : 'Unblock'}
                </Button>
              ) : (
                <Button
                  variant="outline"
                  size="sm"
                  className="gap-2 text-destructive border-destructive/30 hover:bg-destructive/5"
                  onClick={handleBlock}
                  disabled={blockMutation.isPending}
                >
                  <ShieldOff className="size-4" />
                  {blockMutation.isPending ? 'Blocking...' : 'Block'}
                </Button>
              )}

              {manager.isActive && (
                <Button
                  variant="outline"
                  size="sm"
                  className="gap-2 text-muted-foreground"
                  onClick={handleDeactivate}
                  disabled={deleteMutation.isPending}
                >
                  <ShieldAlert className="size-4" />
                  {deleteMutation.isPending ? 'Deactivating...' : 'Deactivate'}
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
            <InfoRow icon={Mail}  label="Email" value={manager.email} />
            <InfoRow icon={Phone} label="Phone" value={manager.phone} />
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
              value={manager.lastLogin
                ? new Date(manager.lastLogin).toLocaleString()
                : 'Never logged in'}
            />
            <InfoRow
              icon={manager.isVerified ? ShieldCheck : ShieldAlert}
              label="Verification"
              value={manager.isVerified ? 'Verified' : 'Not verified'}
            />
            <InfoRow
              icon={Clock}
              label="Created"
              value={new Date(manager.createdAt).toLocaleDateString('en-US', {
                year: 'numeric', month: 'long', day: 'numeric',
              })}
            />
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-0 pt-5 px-6">
            <CardTitle className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
              Status flags
            </CardTitle>
          </CardHeader>
          <CardContent className="px-6 pb-2 divide-y divide-border">
            <FlagRow
              label="Account active"
              active={manager.isActive}
              activeLabel="Active"
              inactiveLabel="Inactive"
            />
            <FlagRow
              label="Blocked"
              active={manager.isBlocked}
              activeLabel="Blocked"
              inactiveLabel="No"
            />
            <FlagRow
              label="Password setup"
              active={!manager.isFirstTime}
              activeLabel="Complete"
              inactiveLabel="Pending"
            />
          </CardContent>
        </Card>

      </div>
    </div>
  )
}
