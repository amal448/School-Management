import { BookOpen } from 'lucide-react'

export const NoExamRow = ({ subjectName }: { subjectName: string }) => (
  <div className="flex items-center gap-3 px-6 py-3.5 border-b last:border-b-0 border-border">
    <div className="size-8 rounded-lg bg-muted flex items-center justify-center shrink-0">
      <BookOpen className="size-4 text-muted-foreground" />
    </div>
    <div>
      <p className="text-sm font-medium">{subjectName}</p>
      <p className="text-xs text-muted-foreground">No active exam</p>
    </div>
  </div>
)
