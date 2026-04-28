import { useState, } from 'react'
import { PageRoot, PageHeader } from '@/components/ui/page'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent } from '@/components/ui/card'
import {
  Plus, Trophy
} from 'lucide-react'
import {
  useToppers, useCreateTopper,
} from '@/hooks/topper/useToppers'
import { TopperResponse } from '@/types/topper.types'
import { TopperRow } from '@/components/topper/TopperRow'
import { TopperFormDialog } from '@/components/topper/TopperFormDialog'


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