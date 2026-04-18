import { useState }        from 'react'
import { PageRoot, PageHeader } from '@/components/ui/page'
import { useForm }         from 'react-hook-form'
import { Button }          from '@/components/ui/button'
import { Input }           from '@/components/ui/input'
import { Label }           from '@/components/ui/label'
import { Badge }           from '@/components/ui/badge'
import { Card, CardContent } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import {
  Plus, Search, Pin, PinOff, Eye, EyeOff,
  Trash2, Pencil, Calendar, Megaphone,
} from 'lucide-react'
import { CrudDialog }      from '@/components/shared/CrudDialog'
import {
  useAnnouncements,
  useCreateAnnouncement,
  useUpdateAnnouncement,
  usePublishAnnouncement,
  useUnpublishAnnouncement,
  useTogglePin,
  useDeleteAnnouncement,
} from '@/hooks/announcement/useAnnouncements'
import { AnnouncementResponse,AnnouncementCategory,
  CreateAnnouncementInput,
  CATEGORY_LABELS,
  CATEGORY_COLORS, } from '@/types/announcement.types'


// ── Category badge ─────────────────────────────────────
const CategoryBadge = ({ category }: { category: AnnouncementCategory}) => (
  <span style={{
    background:    `${CATEGORY_COLORS[category]}20`,
    color:         CATEGORY_COLORS[category],
    fontSize:      10,
    fontWeight:    600,
    letterSpacing: '0.1em',
    textTransform: 'uppercase',
    padding:       '3px 8px',
    borderRadius:  4,
  }}>
    {CATEGORY_LABELS[category]}
  </span>
)

// ── Create / Edit dialog ───────────────────────────────
const AnnouncementFormDialog = ({
  announcement,
  trigger,
  onSave,
}: {
  announcement?: AnnouncementResponse
  trigger:       React.ReactNode
  onSave:        (data: CreateAnnouncementInput) => void
}) => {
  const isEdit = !!announcement

  const { register, handleSubmit, reset, formState: { isDirty, errors } } =
    useForm<CreateAnnouncementInput>({
      defaultValues: announcement
        ? {
            title:      announcement.title,
            content:    announcement.content,
            category:   announcement.category,
            eventDate:  announcement.eventDate?.split('T')[0] ?? '',
            isPublished: announcement.isPublished,
            isPinned:   announcement.isPinned,
          }
        : {
            category:   'notice',
            isPublished: false,
            isPinned:   false,
          },
    })

  return (
    <CrudDialog
      trigger={trigger}
      title={isEdit ? 'Edit announcement' : 'New announcement'}
      description={isEdit
        ? 'Update this announcement.'
        : 'Create a new announcement for the notice board.'
      }
      submitLabel={isEdit ? 'Save changes' : 'Create'}
      isDirty={isDirty}
      onSubmit={handleSubmit(onSave)}
      onOpenChange={(open) => { if (!open) reset() }}
    >
      <div className="flex flex-col gap-1.5">
        <Label>Title</Label>
        <Input
          placeholder="Announcement title"
          {...register('title', { required: 'Required' })}
        />
        {errors.title && (
          <p className="text-xs text-destructive">{errors.title.message}</p>
        )}
      </div>

      <div className="flex flex-col gap-1.5">
        <Label>Content</Label>
        <textarea
          rows={4}
          placeholder="Announcement content..."
          className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm resize-none focus:outline-none focus:ring-1 focus:ring-ring"
          {...register('content', { required: 'Required' })}
        />
        {errors.content && (
          <p className="text-xs text-destructive">{errors.content.message}</p>
        )}
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div className="flex flex-col gap-1.5">
          <Label>Category</Label>
          <select
            className="h-10 w-full rounded-md border border-input bg-background px-3 text-sm"
            {...register('category')}
          >
            {Object.entries(CATEGORY_LABELS).map(([v, l]) => (
              <option key={v} value={v}>{l}</option>
            ))}
          </select>
        </div>
        <div className="flex flex-col gap-1.5">
          <Label>
            Event date
            <span className="text-muted-foreground ml-1">(optional)</span>
          </Label>
          <Input type="date" {...register('eventDate')} />
        </div>
      </div>

      <div className="flex items-center gap-6">
        <label className="flex items-center gap-2 cursor-pointer">
          <input type="checkbox" className="size-4" {...register('isPublished')} />
          <span className="text-sm">Publish immediately</span>
        </label>
        <label className="flex items-center gap-2 cursor-pointer">
          <input type="checkbox" className="size-4" {...register('isPinned')} />
          <span className="text-sm">Pin to top</span>
        </label>
      </div>
    </CrudDialog>
  )
}

// ── Announcement row ───────────────────────────────────
const AnnouncementRow = ({
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

// ── Public preview card ────────────────────────────────
const PublicCard = ({ announcement }: { announcement: AnnouncementResponse }) => {
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

// ── Stats bar ──────────────────────────────────────────
const StatsBar = ({ data }: { data: AnnouncementResponse[] }) => {
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

// ── Page ──────────────────────────────────────────────
export default function AnnouncementsPage() {
  const [search,   setSearch]   = useState('')
  const [category, setCategory] = useState<AnnouncementCategory | ''>('')

  const { data, isLoading } = useAnnouncements({
    search:   search  || undefined,
    category: category || undefined,
  })

  const createMutation = useCreateAnnouncement()

  const allAnnouncements  = data?.data ?? []
  const published         = allAnnouncements.filter((a) => a.isPublished)
  const sorted            = [...published].sort((a, b) =>
    Number(b.isPinned) - Number(a.isPinned) ||
    new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  )

  return (
    <PageRoot>
      <PageHeader
        title="Announcements"
        description="Manage notices, events, and results for the public notice board"
        actions={
          <AnnouncementFormDialog
            trigger={
              <Button className="gap-2">
                <Plus className="size-4" />
                New announcement
              </Button>
            }
            onSave={(data) => createMutation.mutate(data)}
          />
        }
      />

      {/* ── Stats ── */}
      {!isLoading && allAnnouncements.length > 0 && (
        <StatsBar data={allAnnouncements} />
      )}

      {/* ── Tabs ── */}
      <Tabs defaultValue="all">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <TabsList>
            <TabsTrigger value="all">All</TabsTrigger>
            <TabsTrigger value="preview">Public preview</TabsTrigger>
          </TabsList>

          {/* Filters */}
          <div className="flex gap-2 flex-wrap">
            <div className="relative">
              <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 size-3.5 text-muted-foreground" />
              <Input
                placeholder="Search..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-8 h-8 text-xs w-48"
              />
            </div>
            <select
              className="h-8 rounded-md border border-input bg-background px-3 text-xs"
              value={category}
              onChange={(e) => setCategory(e.target.value as any)}
            >
              <option value="">All categories</option>
              {Object.entries(CATEGORY_LABELS).map(([v, l]) => (
                <option key={v} value={v}>{l}</option>
              ))}
            </select>
          </div>
        </div>

        {/* ── All tab ── */}
        <TabsContent value="all" className="mt-4">
          <Card>
            {isLoading ? (
              <div className="flex flex-col gap-2 p-6 animate-pulse">
                {[...Array(4)].map((_, i) => (
                  <div key={i} className="h-16 bg-muted rounded-lg" />
                ))}
              </div>
            ) : !allAnnouncements.length ? (
              <CardContent className="py-12 text-center">
                <Megaphone className="size-8 text-muted-foreground mx-auto mb-3" />
                <p className="text-sm text-muted-foreground">
                  No announcements yet. Create one to get started.
                </p>
              </CardContent>
            ) : (
              <div className="divide-y divide-border">
                {allAnnouncements.map((a) => (
                  <AnnouncementRow key={a.id} announcement={a} />
                ))}
              </div>
            )}
          </Card>
        </TabsContent>

        {/* ── Public preview tab ── */}
        <TabsContent value="preview" className="mt-4">
          <Card>
            <div className="px-6 py-4 border-b border-border flex items-center justify-between">
              <p className="text-sm font-medium">Notice board — public view</p>
              <span className="text-xs text-muted-foreground">
                {sorted.length} published
              </span>
            </div>
            {!sorted.length ? (
              <CardContent className="py-12 text-center">
                <p className="text-sm text-muted-foreground">
                  No published announcements. Publish some to see the preview.
                </p>
              </CardContent>
            ) : (
              <div>
                {sorted.map((a) => (
                  <PublicCard key={a.id} announcement={a} />
                ))}
              </div>
            )}
          </Card>
        </TabsContent>
      </Tabs>
    </PageRoot>
  )
}