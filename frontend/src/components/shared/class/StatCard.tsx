import { StatProps } from "@/types/class.types";


export const StatCard = ({ label, value, icon: Icon }: StatProps) => (
  <div className="bg-secondary rounded-lg p-4 flex flex-col gap-3">
    <div className="size-8 rounded-md bg-background flex items-center justify-center">
      <Icon className="size-4 text-muted-foreground" />
    </div>
    <div>
      <p className="text-xs text-muted-foreground">{label}</p>
      <p className="text-2xl font-medium mt-0.5">{value}</p>
    </div>
  </div>
)