import { useState, useRef } from 'react'
import { PageRoot, PageHeader } from '@/components/ui/page'
import { useForm } from 'react-hook-form'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent } from '@/components/ui/card'
import { Avatar } from '@/components/shared/Avatar'
import { CrudDialog } from '@/components/shared/CrudDialog'
import {
  Plus, Pencil, Trash2, Eye, EyeOff,
  Trophy, Upload, Loader2,
} from 'lucide-react'
import {
  useToppers, useCreateTopper, useUpdateTopper,
  usePublishTopper, useUnpublishTopper, useDeleteTopper,
} from '@/hooks/topper/useToppers'
import { TopperResponse, CreateTopperInput } from '@/types/topper.types'
import { topperApi } from '@/api/topper.api'
import { CURRENT_ACADEMIC_YEAR, ACADEMIC_YEAR_OPTIONS } from '@/constants/exam.constants'

const MEDAL: Record<number, string> = { 1: '🥇', 2: '🥈', 3: '🥉' }

// ── Image uploader ─────────────────────────────────────
const ImageUploader = ({
  value,
  onChange,
}: {
  value?: string
  onChange: (url: string) => void
}) => {
  const [uploading, setUploading] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)

  const handleFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    setUploading(true)
    try {
      const url = await topperApi.uploadImage(file)
      onChange(url)
    } catch {
      // handle silently
    } finally {
      setUploading(false)
    }
  }

  return (
    <div className="flex items-center gap-3">
      {value ? (
        <img
          src={value}
          alt="Preview"
          className="size-14 rounded-full object-cover border border-border"
        />
      ) : (
        <div className="size-14 rounded-full bg-muted flex items-center justify-center border border-border">
          <Trophy className="size-6 text-muted-foreground" />
        </div>
      )}
      <div className="flex flex-col gap-1">
        <Button
          type="button"
          variant="outline"
          size="sm"
          className="gap-2 text-xs h-7"
          onClick={() => inputRef.current?.click()}
          disabled={uploading}
        >
          {uploading
            ? <Loader2 className="size-3.5 animate-spin" />
            : <Upload className="size-3.5" />
          }
          {uploading ? 'Uploading...' : 'Upload photo'}
        </Button>
        {value && (
          <button
            type="button"
            className="text-xs text-destructive hover:underline text-left"
            onClick={() => onChange('')}
          >
            Remove
          </button>
        )}
        <input
          ref={inputRef}
          type="file"
          accept="image/jpeg,image/png,image/webp"
          className="hidden"
          onChange={handleFile}
        />
      </div>
    </div>
  )
}

// ── Topper form dialog ─────────────────────────────────
const TopperFormDialog = ({
  topper,
  trigger,
  onSave,
}: {
  topper?: TopperResponse
  trigger: React.ReactNode
  onSave: (data: CreateTopperInput) => void
}) => {
  const [photoUrl, setPhotoUrl] = useState(topper?.photoUrl ?? '')
  const isEdit = !!topper

  const { register, handleSubmit, reset, formState: { isDirty, errors } } =
    useForm<CreateTopperInput>({
      defaultValues: topper
        ? {
          name: topper.name,
          grade: topper.grade,
          department: topper.department ?? '',
          marks: topper.marks,
          totalMarks: topper.totalMarks,
          rank: topper.rank,
          academicYear: topper.academicYear,
          isPublished: topper.isPublished,
        }
        : {
          grade: '10',
          academicYear: CURRENT_ACADEMIC_YEAR,
          isPublished: false,
        },
    })

  return (
    <CrudDialog
      trigger={trigger}
      title={isEdit ? 'Edit topper' : 'Add topper'}
      description="Add a board topper for display on the public site."
      submitLabel={isEdit ? 'Save changes' : 'Add topper'}
      isDirty={isDirty || photoUrl !== (topper?.photoUrl ?? '')}
      onSubmit={handleSubmit(
        (data) => onSave({ ...data, photoUrl: photoUrl || undefined }),
        (errors) => console.log("FORM VALIDATION ERRORS:", errors)
      )}

      onOpenChange={(open) => {
        if (!open) {
          reset()
          setPhotoUrl(topper?.photoUrl ?? '')
        }
      }}

    >
      {/* Photo */}
      <div className="flex flex-col gap-1.5">
        <ImageUploader value={photoUrl} onChange={setPhotoUrl} />
      </div>

      {/* Name */}
      <div className="flex flex-col gap-1.5">
        <Label>Student name</Label>
        <Input
          placeholder="Full name"
          {...register('name', { required: 'Required' })}
        />
        {errors.name && (
          <p className="text-xs text-destructive">{errors.name.message}</p>
        )}
      </div>

      {/* Grade + Rank */}
      <div className="grid grid-cols-2 gap-3">
        <div className="flex flex-col gap-1.5">
          <Label>Grade</Label>
          <select
            className="h-10 w-full rounded-md border border-input bg-background px-3 text-sm"
            {...register('grade', { required: 'Required' })}
          >
            {['1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12'].map((g) => (
              <option key={g} value={g}>Grade {g}</option>
            ))}
          </select>
        </div>
        <div className="flex flex-col gap-1.5">
          <Label>Rank</Label>
          <select
            className="h-10 w-full rounded-md border border-input bg-background px-3 text-sm"
            {...register('rank', {
              setValueAs: (v) => (v === '' ? undefined : Number(v)),
            })}
          >
            <option value="">Select Rank (optional)</option>
            {[1, 2, 3].map((r) => (
              <option key={r} value={r}>
                Rank {r}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* marks */}
      <div className="flex flex-col gap-1.5">
        <Label>Marks</Label>
        <Input
          type="number"
          placeholder="enter the mark scored"
          {...register('marks', {
            required: 'Required',
          })}
        />
        {errors.marks && (
          <p className="text-xs text-destructive">{errors.marks.message}</p>
        )}
      </div>
      <div className="flex flex-col gap-1.5">
        <Label>TotalMarks</Label>
        <Input
          type="number"
          placeholder="enter the total mark"
          {...register('totalMarks', {
            required: 'Required',
          })}
        />
        {errors.totalMarks && (
          <p className="text-xs text-destructive">{errors.totalMarks.message}</p>
        )}
      </div>

      {/* Department + Year */}
      <div className="grid grid-cols-2 gap-3">
        <div className="flex flex-col gap-1.5">
          <Label>Department <span className="text-muted-foreground">(optional)</span></Label>
          <Input
            placeholder="Science, Commerce..."
            {...register('department')}
          />
        </div>
        <div className="flex flex-col gap-1.5">
          <Label>Academic year</Label>
          <select
            className="h-10 w-full rounded-md border border-input bg-background px-3 text-sm"
            {...register('academicYear')}
          >
            {ACADEMIC_YEAR_OPTIONS.map((y) => (
              <option key={y} value={y}>{y}</option>
            ))}
          </select>
        </div>
      </div>

      <label className="flex items-center gap-2 cursor-pointer">
        <input type="checkbox" className="size-4" {...register('isPublished')} />
        <span className="text-sm">Publish immediately</span>
      </label>
    </CrudDialog>
  )
}

// ── Topper card row ────────────────────────────────────
const TopperRow = ({ topper }: { topper: TopperResponse }) => {
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

// ── Page ──────────────────────────────────────────────
export default function ToppersPage() {
  const [gradeFilter, setGradeFilter] = useState('')
  const { data, isLoading } = useToppers({
    grade: gradeFilter || undefined,
  })
  const createMutation = useCreateTopper()
  const toppers = data?.data ?? []

  // Group by grade for display
  const byGrade = toppers.reduce<Record<string, TopperResponse[]>>(
    (acc, t) => {
      if (!acc[t.grade]) acc[t.grade] = []
      acc[t.grade]!.push(t)
      return acc
    }, {}
  )

  return (
    <PageRoot>
      <PageHeader
        title="Board toppers"
        description="Manage toppers displayed on the public site"
        actions={
          <div className="flex gap-2">
            <select
              className="h-9 rounded-md border border-input bg-background px-3 text-xs"
              value={gradeFilter}
              onChange={(e) => setGradeFilter(e.target.value)}
            >
              <option value="">All grades</option>
              {['10', '12'].map((g) => (
                <option key={g} value={g}>Grade {g}</option>
              ))}
            </select>
            <TopperFormDialog
              trigger={
                <Button className="gap-2 h-9">
                  <Plus className="size-4" />
                  Add topper
                </Button>
              }
              onSave={(data) => createMutation.mutate(data)}
            />
          </div>
        }
      />

      {/* ── Stats ── */}
      <div className="grid grid-cols-3 gap-3">
        {[
          { label: 'Total', value: toppers.length },
          { label: 'Published', value: toppers.filter((t) => t.isPublished).length },
          { label: 'Draft', value: toppers.filter((t) => !t.isPublished).length },
        ].map(({ label, value }) => (
          <div key={label} className="bg-secondary rounded-lg p-3">
            <p className="text-xs text-muted-foreground">{label}</p>
            <p className="text-xl font-medium mt-0.5">{value}</p>
          </div>
        ))}
      </div>

      {/* ── Grouped by grade ── */}
      {isLoading ? (
        <div className="flex flex-col gap-3 animate-pulse">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="h-16 bg-muted rounded-xl" />
          ))}
        </div>
      ) : !toppers.length ? (
        <Card>
          <CardContent className="py-12 text-center">
            <Trophy className="size-8 text-muted-foreground mx-auto mb-3" />
            <p className="text-sm text-muted-foreground">
              No toppers added yet. Add your first topper.
            </p>
          </CardContent>
        </Card>
      ) : (
        Object.entries(byGrade)
          .sort(([a], [b]) => Number(a) - Number(b))
          .map(([grade, gradeToppers]) => (
            <Card key={grade}>
              <div className="px-6 py-3.5 border-b border-border flex items-center gap-2">
                <Trophy className="size-4 text-amber-500" />
                <p className="text-sm font-medium">Grade {grade}</p>
                <Badge variant="secondary" className="text-xs ml-auto">
                  {gradeToppers.length} toppers
                </Badge>
              </div>
              <div>
                {gradeToppers
                  .sort((a, b) => a.rank - b.rank)
                  .map((t) => (
                    <TopperRow key={t.id} topper={t} />
                  ))}
              </div>
            </Card>
          ))
      )}
    </PageRoot>
  )
}