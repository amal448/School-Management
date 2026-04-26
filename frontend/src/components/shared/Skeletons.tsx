import { Skeleton } from '@/components/ui/skeleton'

export const ListSkeleton = ({ count = 3 }: { count?: number }) => (
  <div className="flex flex-col gap-3">
    {Array.from({ length: count }).map((_, i) => (
      <Skeleton key={i} className="h-20 w-full rounded-xl" />
    ))}
  </div>
)

export const TableSkeleton = ({ rows = 5, columns = 4 }: { rows?: number, columns?: number }) => (
  <div className="border rounded-lg overflow-hidden w-full">
    <div className="h-12 bg-muted/50 border-b flex items-center px-4 gap-4">
      {Array.from({ length: columns }).map((_, j) => (
        <Skeleton key={j} className="h-4 w-full" />
      ))}
    </div>
    <div className="divide-y divide-border">
      {Array.from({ length: rows }).map((_, i) => (
        <div key={i} className="h-14 flex items-center px-4 gap-4">
          {Array.from({ length: columns }).map((_, j) => (
            <Skeleton key={j} className="h-4 w-full" />
          ))}
        </div>
      ))}
    </div>
  </div>
)

export const CardSkeleton = ({ count = 4 }: { count?: number }) => (
  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 w-full">
    {Array.from({ length: count }).map((_, i) => (
      <Skeleton key={i} className="h-32 rounded-xl" />
    ))}
  </div>
)

export const ProfileSkeleton = () => (
  <div className="space-y-6 w-full animate-in fade-in duration-500">
    <div className="flex items-center gap-4">
      <Skeleton className="h-20 w-20 rounded-full" />
      <div className="space-y-2 flex-col flex items-start">
        <Skeleton className="h-6 w-48" />
        <Skeleton className="h-4 w-32" />
      </div>
    </div>
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
      <Skeleton className="h-24 rounded-xl" />
      <Skeleton className="h-24 rounded-xl" />
    </div>
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      <Skeleton className="h-32 rounded-xl" />
      <Skeleton className="h-32 rounded-xl" />
      <Skeleton className="h-32 rounded-xl" />
    </div>
  </div>
)

export const DetailPageSkeleton = () => (
  <div className="p-6 space-y-6 flex flex-col w-full animate-in fade-in duration-500">
    <div className="flex items-center gap-4">
      <Skeleton className="h-10 w-10 rounded-md" />
      <div className="space-y-2 flex-col flex items-start">
        <Skeleton className="h-6 w-48" />
        <Skeleton className="h-4 w-32" />
      </div>
    </div>
    <CardSkeleton count={4} />
    <ListSkeleton count={3} />
  </div>
)
