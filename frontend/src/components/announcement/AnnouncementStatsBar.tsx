import { AnnouncementResponse } from '@/types/announcement.types'

export const AnnouncementStatsBar = ({ data }: { data: AnnouncementResponse[] }) => {
  const stats = [
    { label: 'Total',     value: data.length },
    { label: 'Published', value: data.filter((a) => a.isPublished).length },
    { label: 'Draft',     value: data.filter((a) => !a.isPublished).length },
    { label: 'Pinned',    value: data.filter((a) => a.isPinned).length },
  ]

  return (
    <div className="grid grid-cols-4 gap-3">
      {stats.map(({ label, value }) => (
        <div key={label} className="bg-secondary rounded-lg p-3">
          <p className="text-xs text-muted-foreground">{label}</p>
          <p className="text-xl font-medium mt-0.5">{value}</p>
        </div>
      ))}
    </div>
  )
}
