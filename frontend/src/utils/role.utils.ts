import {
  Role, ROLES, ROUTES,
  NAV_BY_ROLE, NavItem,
} from '@/config/routes.config'

export const getDashboardPath = (role: Role): string => {
  const map: Record<Role, string> = {
    [ROLES.ADMIN]:   ROUTES.ADMIN.DASHBOARD,
    [ROLES.MANAGER]: ROUTES.MANAGER.DASHBOARD,
    [ROLES.TEACHER]: ROUTES.TEACHER.DASHBOARD,
    [ROLES.STUDENT]: ROUTES.STUDENT.DASHBOARD,
  }
  return map[role]
}

export const getLoginPath = (role: Role): string => {
  if (role === ROLES.ADMIN || role === ROLES.MANAGER) {
    return ROUTES.AUTH.ADMIN_MANAGER_LOGIN
  }
  return ROUTES.AUTH.TEACHER_STUDENT_LOGIN
}

export const getNavItems = (role: Role): NavItem[] => {
  return NAV_BY_ROLE[role] ?? []
}