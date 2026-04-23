import { Pin, Calendar } from 'lucide-react'
import { AnnouncementResponse, CATEGORY_COLORS } from '@/types/announcement.types'
import { CategoryBadge } from '@/components/announcement/CategoryBadge'

export const PublicCard = ({ announcement }: { announcement: AnnouncementResponse }) => {
  const isNew = (Date.now() - new Date(announcement.createdAt).getTime())
    < 7 * 24 * 60 * 60 * 1000

  const color = CATEGORY_COLORS[announcement.category]

  return (
    <div style={{
      borderLeft:  announcement.isPinned ? `3px solid ${color}` : '3px solid transparent',
      background:  announcement.isPinned ? `${color}08` : undefined,
      padding:     '16px 20px',
      borderBottom: '1px solid var(--border)',
    }}>
      <div className="flex items-start justify-between gap-3">
        <div className="flex flex-col gap-1 min-w-0 flex-1">
          <div className="flex items-center gap-2 flex-wrap">
            <CategoryBadge category={announcement.category} />
            {isNew && (
              <span className="text-xs font-medium text-green-600 bg-green-50 dark:bg-green-950/20 px-1.5 py-0.5 rounded">
                New
              </span>
            )}
            {announcement.isPinned && (
              <span className="text-xs text-muted-foreground flex items-center gap-1">
                <Pin className="size-3" /> Pinned
              </span>
            )}
          </div>
          <p className="text-sm font-medium mt-1">{announcement.title}</p>
          <p className="text-xs text-muted-foreground line-clamp-2 mt-0.5">
            {announcement.content}
          </p>
          <div className="flex items-center gap-3 mt-1.5 text-xs text-muted-foreground">
            <span>
              {new Date(announcement.createdAt).toLocaleDateString('en-US', {
                day: 'numeric', month: 'short', year: 'numeric',
              })}
            </span>
            {announcement.eventDate && (
              <span className="flex items-center gap-1" style={{ color }}>
                <Calendar className="size-3" />
                {new Date(announcement.eventDate).toLocaleDateString('en-US', {
                  day: 'numeric', month: 'short', year: 'numeric',
                })}
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
