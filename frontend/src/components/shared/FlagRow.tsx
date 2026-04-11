import { Badge } from "../ui/badge"

export const FlagRow = ({
  label, active, activeLabel = 'Yes', inactiveLabel = 'No',
}: {
  label: string
  active: boolean
  activeLabel?: string
  inactiveLabel?: string
}) => (
  <div className="flex items-center justify-between py-3">
    <span className="text-sm text-muted-foreground">{label}</span>
    <Badge variant={active ? 'default' : 'secondary'}>
      {active ? activeLabel : inactiveLabel}
    </Badge>
  </div>
)