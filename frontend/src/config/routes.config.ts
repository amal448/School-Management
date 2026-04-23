import {
  LayoutDashboard, Users, GraduationCap, BookOpen,
  Building2, ClipboardList, BarChart3, Settings,
  School, CheckSquare, FileText, TrendingUp,
  Trophy, Calendar,
  type LucideIcon,
  User,
  Megaphone,
} from 'lucide-react'

export const ROLES = {
  ADMIN: 'ADMIN',
  MANAGER: 'MANAGER',
  TEACHER: 'TEACHER',
  STUDENT: 'STUDENT',
} as const

export type Role = typeof ROLES[keyof typeof ROLES]

export const ROUTES = {
  AUTH: {
    ADMIN_MANAGER_LOGIN: '/admin/login',
    ADMIN_GOOGLE_CALLBACK: '/auth/callback',
    STUDENT_LOGIN: '/login',
    VERIFY_OTP: '/auth/verify-otp',
    FORGOT_PASSWORD: '/auth/forgot-password',
    RESET_PASSWORD: '/auth/reset-password',
    FIRST_TIME_SETUP: '/auth/first-time-setup',
    UNAUTHORIZED: '/unauthorized',
  },
  ADMIN: {
    ROOT: '/admin',
    DASHBOARD: '/admin/dashboard',
    TEACHERS: '/admin/teacher',
    // STUDENTS:    '/admin/students',
    MANAGER: '/admin/manager',
    CLASSES: '/admin/classes',
    DEPARTMENTS: '/admin/departments',
    SUBJECTS: '/admin/subjects',
    EXAMS: '/admin/exams',
  },
  MANAGER: {
    ROOT: '/manager',
    DASHBOARD: '/manager/dashboard',
    TEACHERS: '/manager/teacher',
    STUDENTS: '/manager/students',
    CLASSES: '/manager/classes',
    SUBJECTS: '/manager/subjects',
    DEPARTMENTS: '/manager/departments',
    EXAMS: '/manager/exams',
    ANALYTICS: '/manager/analytics',
    LEADERBOARD: '/manager/leaderboard',
    TASKS: '/manager/tasks',
  },
  TEACHER: {
    ROOT: '/teacher',
    DASHBOARD: '/teacher/dashboard',
    CLASSES: '/teacher/classes',
    ATTENDANCE: '/teacher/attendance',
    MARKS: '/teacher/marks',
    ASSIGNMENTS: '/teacher/assignments',
    STUDENTS: '/teacher/students',
    PROFILE: '/teacher/profile',

  },
  STUDENT: {
    ROOT: '/student',
    DASHBOARD: '/student/dashboard',
    RESULTS: '/student/results',
  },
} as const

export interface NavItem {
  label: string
  path: string
  icon: LucideIcon
}

export const ADMIN_NAV: NavItem[] = [
  { label: 'Dashboard', path: ROUTES.ADMIN.DASHBOARD, icon: LayoutDashboard },
  { label: 'Manager', path: ROUTES.ADMIN.MANAGER, icon: Users },
  { label: 'Teacher', path: ROUTES.ADMIN.TEACHERS, icon: Users },
  // { label: 'Students',    path: ROUTES.ADMIN.STUDENTS,    icon: GraduationCap   },
  { label: 'Classes', path: ROUTES.ADMIN.CLASSES, icon: School },
  { label: 'Departments', path: ROUTES.ADMIN.DEPARTMENTS, icon: Building2 },
  { label: 'Subjects', path: ROUTES.ADMIN.SUBJECTS, icon: BookOpen },
  { label: 'Exams', path: ROUTES.ADMIN.EXAMS, icon: ClipboardList },
  { label: 'Announcements', path: '/admin/announcements', icon: Megaphone },
  { label: 'Achievements', path: '/admin/topper', icon: Users }
  // { label: 'Exams', path: '/ad/exams', icon: Calendar },
]

export const MANAGER_NAV: NavItem[] = [
  { label: 'Dashboard', path: ROUTES.MANAGER.DASHBOARD, icon: LayoutDashboard },
  // { label: 'Students',    path: ROUTES.MANAGER.STUDENTS,    icon: GraduationCap   },
  { label: 'Teachers', path: ROUTES.MANAGER.TEACHERS, icon: Users },
  { label: 'Classes', path: ROUTES.MANAGER.CLASSES, icon: School },
  { label: 'Subjects', path: ROUTES.MANAGER.SUBJECTS, icon: BookOpen },
  { label: 'Departments', path: ROUTES.MANAGER.DEPARTMENTS, icon: Building2 },
  { label: 'Exams', path: ROUTES.MANAGER.EXAMS, icon: ClipboardList },
  { label: 'Announcements', path: '/manager/announcements', icon: Megaphone }

 ]

export const TEACHER_NAV: NavItem[] = [
  { label: 'Dashboard', path: ROUTES.TEACHER.DASHBOARD, icon: LayoutDashboard },
  { label: 'My Classes', path: ROUTES.TEACHER.CLASSES, icon: School },

]

export const STUDENT_NAV: NavItem[] = [
  { label: 'Dashboard', path: ROUTES.STUDENT.DASHBOARD, icon: LayoutDashboard },
  { label: 'Results', path: ROUTES.STUDENT.RESULTS, icon: FileText },
]

export const NAV_BY_ROLE: Record<Role, NavItem[]> = {
  [ROLES.ADMIN]: ADMIN_NAV,
  [ROLES.MANAGER]: MANAGER_NAV,
  [ROLES.TEACHER]: TEACHER_NAV,
  [ROLES.STUDENT]: STUDENT_NAV,
}