import { ManagerResponse } from "@/types/manager.types"
import { Badge } from "../ui/badge"
import { TeacherResponse } from "@/types/teacher.types"

export const StatusBadge = ({ manager }: { manager: ManagerResponse }) => {
  if (manager.isBlocked)   return <Badge variant="destructive">Blocked</Badge>
  if (!manager.isActive)   return <Badge variant="secondary">Inactive</Badge>
  if (manager.isFirstTime) return <Badge variant="outline">Pending Setup</Badge>
  return <Badge variant="default">Active</Badge>
}
export const TeacherStatusBadge = ({ teacher }: { teacher: TeacherResponse }) => {
  if (!teacher.isActive)   return <Badge variant="secondary">Inactive</Badge>
  if (teacher.isFirstTime) return <Badge variant="outline">Pending Setup</Badge>
  if (!teacher.isVerified) return <Badge variant="outline">Unverified</Badge>
  return <Badge variant="default">Active</Badge>
}
