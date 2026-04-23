export const TeacherClassesSkeleton = () => (
  <div className="flex flex-col gap-6 animate-pulse p-6">
    <div className="h-8 w-48 bg-muted rounded" />
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
      {[...Array(4)].map((_, i) => (
        <div key={i} className="h-24 bg-muted rounded-xl" />
      ))}
    </div>
  </div>
)
