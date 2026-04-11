export const Skeleton = () => (
  <div className="flex flex-col gap-3 animate-pulse">
    {[...Array(3)].map((_, i) => (
      <div key={i} className="h-20 bg-muted rounded-xl" />
    ))}
  </div>
)