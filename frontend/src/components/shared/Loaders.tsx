import { Loader2 } from 'lucide-react'

interface PageLoaderProps {
  text?: string
}

export const PageLoader = ({ text = "Loading..." }: PageLoaderProps) => (
  <div className="flex flex-col items-center justify-center p-12 min-h-[50vh] gap-4 text-muted-foreground w-full">
    <Loader2 className="h-10 w-10 animate-spin text-primary/80" />
    <p className="text-sm font-medium animate-pulse">{text}</p>
  </div>
)

export const SectionLoader = ({ text = "Loading..." }: PageLoaderProps) => (
  <div className="flex flex-col items-center justify-center py-8 gap-3 text-muted-foreground w-full">
    <Loader2 className="h-6 w-6 animate-spin text-primary/70" />
    <span className="text-sm">{text}</span>
  </div>
)

export const InlineLoader = ({ text }: PageLoaderProps) => (
  <div className="flex items-center gap-2 text-muted-foreground">
    <Loader2 className="h-4 w-4 animate-spin" />
    {text && <span className="text-xs">{text}</span>}
  </div>
)
