import { useState } from 'react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Pin, PinOff, Eye, EyeOff, Trash2, Pencil, Calendar } from 'lucide-react'
import {
  useUpdateAnnouncement,
  usePublishAnnouncement,
  useUnpublishAnnouncement,
  useTogglePin,
  useDeleteAnnouncement,
} from '@/hooks/announcement/useAnnouncements'
import { AnnouncementResponse } from '@/types/announcement.types'
import { CategoryBadge } from '@/components/announcement/CategoryBadge'
import { AnnouncementFormDialog } from '@/components/announcement/AnnouncementFormDialog'

export const AnnouncementRow = ({
  announcement,
}: {
  announcement: AnnouncementResponse
}) => {
  const publishMutation   = usePublishAnnouncement()
  const unpublishMutation = useUnpublishAnnouncement()
  const pinMutation       = useTogglePin()
  const deleteMutation    = useDeleteAnnouncement()
  const updateMutation    = useUpdateAnnouncement(announcement.id)

  const [confirmDelete, setConfirmDelete] = useState(false)

  const isNew = (Date.now() - new Date(announcement.createdAt).getTime())
    < 7 * 24 * 60 * 60 * 1000

  return (
    <div className="flex items-start gap-3 px-6 py-4 border-b border-border last:border-b-0 hover:bg-muted/30 transition-colors">

      {/* Category + pin indicator */}
      <div className="flex flex-col gap-1.5 items-start pt-0.5 shrink-0">
        <CategoryBadge category={announcement.category} />
        {announcement.isPinned && (
          <Pin className="size-3 text-primary" />
        )}
      </div>

      {/* Content */}
      <div className="flex flex-col gap-1 flex-1 min-w-0">
        <div className="flex items-center gap-2 flex-wrap">
          <p className="text-sm font-medium truncate">{announcement.title}</p>
          {isNew && (
            <Badge variant="secondary" className="text-xs py-0 text-green-600 bg-green-50">
              New
            </Badge>
          )}
          {!announcement.isPublished && (
            <Badge variant="outline" className="text-xs py-0 text-muted-foreground">
              Draft
            </Badge>
          )}
        </div>
        <p className="text-xs text-muted-foreground line-clamp-1">
          {announcement.content}
        </p>
        <div className="flex items-center gap-3 text-xs text-muted-foreground mt-0.5">
          <span>
            {new Date(announcement.createdAt).toLocaleDateString('en-US', {
              day: 'numeric', month: 'short', year: 'numeric',
            })}
          </span>
          {announcement.eventDate && (
            <span className="flex items-center gap-1">
              <Calendar className="size-3" />
              {new Date(announcement.eventDate).toLocaleDateString('en-US', {
                day: 'numeric', month: 'short',
              })}
            </span>
          )}
        </div>
      </div>

      {/* Actions */}
      <div className="flex items-center gap-1 shrink-0">

        {/* Pin toggle */}
        <Button
          variant="ghost"
          size="sm"
          className="h-7 w-7 p-0"
          title={announcement.isPinned ? 'Unpin' : 'Pin'}
          onClick={() => pinMutation.mutate(announcement.id)}
          disabled={pinMutation.isPending}
        >
          {announcement.isPinned
            ? <PinOff className="size-3.5 text-primary" />
            : <Pin    className="size-3.5 text-muted-foreground" />
          }
        </Button>

        {/* Publish toggle */}
        <Button
          variant="ghost"
          size="sm"
          className="h-7 w-7 p-0"
          title={announcement.isPublished ? 'Unpublish' : 'Publish'}
          onClick={() => announcement.isPublished
            ? unpublishMutation.mutate(announcement.id)
            : publishMutation.mutate(announcement.id)
          }
          disabled={publishMutation.isPending || unpublishMutation.isPending}
        >
          {announcement.isPublished
            ? <EyeOff className="size-3.5 text-muted-foreground" />
            : <Eye    className="size-3.5 text-primary" />
          }
        </Button>

        {/* Edit */}
        <AnnouncementFormDialog
          announcement={announcement}
          trigger={
            <Button variant="ghost" size="sm" className="h-7 w-7 p-0">
              <Pencil className="size-3.5 text-muted-foreground" />
            </Button>
          }
          onSave={(data) => updateMutation.mutate(data)}
        />

        {/* Delete */}
        {confirmDelete ? (
          <div className="flex items-center gap-1 ml-1">
            <Button
              variant="destructive"
              size="sm"
              className="h-6 text-xs px-2"
              onClick={() => deleteMutation.mutate(announcement.id)}
              disabled={deleteMutation.isPending}
            >
              Confirm
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className="h-6 text-xs px-2"
              onClick={() => setConfirmDelete(false)}
            >
              Cancel
            </Button>
          </div>
        ) : (
          <Button
            variant="ghost"
            size="sm"
            className="h-7 w-7 p-0"
            onClick={() => setConfirmDelete(true)}
          >
            <Trash2 className="size-3.5 text-destructive" />
          </Button>
        )}
      </div>
    </div>
  )
}
