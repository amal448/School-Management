export const ScheduleCardSkeleton = () => (
  <div className="flex flex-col gap-3 animate-pulse">
    {[...Array(3)].map((_, i) => (
      <div key={i} className="h-24 bg-muted rounded-xl" />
    ))}
  </div>
)
