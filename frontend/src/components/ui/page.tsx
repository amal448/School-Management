import { cn } from '@/lib/utils'

// ── Page shell ─────────────────────────────────────────
export function PageRoot({ className, children, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div className={cn('flex flex-col gap-6', className)} {...props}>
      {children}
    </div>
  )
}

// ── Page header — title + optional actions ─────────────
interface PageHeaderProps extends React.HTMLAttributes<HTMLDivElement> {
  title: string
  description?: string
  actions?: React.ReactNode
}

export function PageHeader({ title, description, actions, className, ...props }: PageHeaderProps) {
  return (
    <div className={cn('flex items-start justify-between gap-4', className)} {...props}>
      <div className="space-y-1">
        <h1 className="text-2xl font-display font-semibold tracking-tight">{title}</h1>
        {description && (
          <p className="text-sm text-muted-foreground">{description}</p>
        )}
      </div>
      {actions && (
        <div className="flex items-center gap-2 shrink-0">{actions}</div>
      )}
    </div>
  )
}

// ── Section — groups related content ──────────────────
export function PageSection({ className, children, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <section className={cn('flex flex-col gap-4', className)} {...props}>
      {children}
    </section>
  )
}

// ── Stats grid ────────────────────────────────────────
export function StatsGrid({ className, children, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div className={cn('grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4', className)} {...props}>
      {children}
    </div>
  )
}

// ── Content grid (2-col layout) ───────────────────────
export function ContentGrid({ className, children, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div className={cn('grid grid-cols-1 lg:grid-cols-3 gap-6', className)} {...props}>
      {children}
    </div>
  )
}

// ── Stat card ─────────────────────────────────────────
import { type LucideIcon } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'

interface StatCardProps {
  title: string
  value: string | number
  subtitle?: string
  icon: LucideIcon
  trend?: { value: number; label: string }
  className?: string
}

export function StatCard({ title, value, subtitle, icon: Icon, trend, className }: StatCardProps) {
  const trendPositive = trend && trend.value >= 0

  return (
    <Card className={cn('shadow-sm', className)}>
      <CardContent className="p-5">
        <div className="flex items-start justify-between">
          <div className="space-y-1">
            <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
              {title}
            </p>
            <p className="text-2xl font-display font-semibold tracking-tight">{value}</p>
            {subtitle && (
              <p className="text-xs text-muted-foreground">{subtitle}</p>
            )}
          </div>
          <div className="size-10 rounded-lg bg-primary/8 flex items-center justify-center shrink-0">
            <Icon className="size-5 text-primary" />
          </div>
        </div>
        {trend && (
          <div className="mt-3 pt-3 border-t flex items-center gap-1">
            <span className={cn(
              'text-xs font-medium',
              trendPositive ? 'text-emerald-600' : 'text-red-500'
            )}>
              {trendPositive ? '↑' : '↓'} {Math.abs(trend.value)}%
            </span>
            <span className="text-xs text-muted-foreground">{trend.label}</span>
          </div>
        )}
      </CardContent>
    </Card>
  )
}