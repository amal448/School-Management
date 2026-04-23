export const StatBox = ({
  label, value, icon: Icon, sub,
}: {
  label: string
  value: number | string
  icon: React.ElementType
  sub?: string
}) => (
  <div className="bg-secondary rounded-xl p-5 flex items-start gap-4">
      <div className="size-10 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
          <Icon className="size-5 text-primary" />
      </div>
      <div>
          <p className="text-xs text-muted-foreground">{label}</p>
          <p className="text-2xl font-medium mt-0.5">{value}</p>
          {sub && <p className="text-xs text-muted-foreground mt-0.5">{sub}</p>}
      </div>
  </div>
)
