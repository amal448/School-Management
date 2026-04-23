import { useState } from 'react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Pencil, Trash2, Eye, EyeOff } from 'lucide-react'
import { Avatar } from '@/components/shared/Avatar'
import {
  useUpdateTopper,
  usePublishTopper,
  useUnpublishTopper,
  useDeleteTopper,
} from '@/hooks/topper/useToppers'
import { TopperResponse } from '@/types/topper.types'
import { TopperFormDialog } from '@/components/topper/TopperFormDialog'

const MEDAL: Record<number, string> = { 1: '🥇', 2: '🥈', 3: '🥉' }

export const TopperRow = ({ topper }: { topper: TopperResponse }) => {
  const [confirmDelete, setConfirmDelete] = useState(false)
  const updateMutation = useUpdateTopper(topper.id)
  const publishMutation = usePublishTopper()
  const unpublishMutation = useUnpublishTopper()
  const deleteMutation = useDeleteTopper()

  return (
    <div className="flex items-center gap-4 px-6 py-3.5 border-b border-border last:border-b-0 hover:bg-muted/30 transition-colors">

      {/* Medal + photo */}
      <div className="flex items-center gap-3 min-w-0 flex-1">
        <span className="text-lg">
          {topper.rank
            ? (MEDAL[topper.rank] ?? `#${topper.rank}`)
            : '🏅'} {/* ✅ fallback medal */}
        </span>
        {topper.photoUrl ? (
          <img
            src={topper.photoUrl}
            alt={topper.name}
            className="size-9 rounded-full object-cover shrink-0"
          />
        ) : (
          <Avatar name={topper.name} size="sm" />
        )}
        <div className="flex flex-col gap-0.5 min-w-0">
          <p className="text-sm font-medium truncate">{topper.name}</p>
          <p className="text-xs text-muted-foreground">
            Grade {topper.grade}
            {topper.department && ` · ${topper.department}`}
            {' · '}{topper.academicYear}
          </p>
        </div>
      </div>

      {/* Percentage */}
      <div className="text-sm font-medium tabular-nums shrink-0">
        {topper.marks}
      </div>

      {/* Status */}
      <div className="shrink-0">
        {topper.isPublished
          ? <Badge variant="default" className="text-xs">Published</Badge>
          : <Badge variant="outline" className="text-xs text-muted-foreground">Draft</Badge>
        }
      </div>

      {/* Actions */}
      <div className="flex items-center gap-1 shrink-0">
        <Button
          variant="ghost" size="sm" className="h-7 w-7 p-0"
          onClick={() => topper.isPublished
            ? unpublishMutation.mutate(topper.id)
            : publishMutation.mutate(topper.id)
          }
        >
          {topper.isPublished
            ? <EyeOff className="size-3.5 text-muted-foreground" />
            : <Eye className="size-3.5 text-primary" />
          }
        </Button>

        <TopperFormDialog
          topper={topper}
          trigger={
            <Button variant="ghost" size="sm" className="h-7 w-7 p-0">
              <Pencil className="size-3.5 text-muted-foreground" />
            </Button>
          }
          onSave={(data) => updateMutation.mutate(data)}
          mutation={updateMutation}
        />

        {confirmDelete ? (
          <div className="flex items-center gap-1">
            <Button
              variant="destructive" size="sm" className="h-6 text-xs px-2"
              onClick={() => deleteMutation.mutate(topper.id)}
              disabled={deleteMutation.isPending}
            >
              Confirm
            </Button>
            <Button
              variant="ghost" size="sm" className="h-6 text-xs px-2"
              onClick={() => setConfirmDelete(false)}
            >
              Cancel
            </Button>
          </div>
        ) : (
          <Button
            variant="ghost" size="sm" className="h-7 w-7 p-0"
            onClick={() => setConfirmDelete(true)}
          >
            <Trash2 className="size-3.5 text-destructive" />
          </Button>
        )}
      </div>
    </div>
  )
}
