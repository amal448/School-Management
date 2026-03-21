import {
  LayoutDashboard, Users, GraduationCap, BookOpen,
  Building2, ClipboardList, BarChart3, Settings,
  School, CheckSquare, FileText, TrendingUp,
  Trophy, Calendar,
  type LucideIcon,
} from 'lucide-react'

export const ROLES = {
  ADMIN:   'ADMIN',
  MANAGER: 'MANAGER',
  TEACHER: 'TEACHER',
  STUDENT: 'STUDENT',
} as const

export type Role = typeof ROLES[keyof typeof ROLES]

export const ROUTES = {
  AUTH: {
    ADMIN_MANAGER_LOGIN:   '/admin/login',
    ADMIN_GOOGLE_CALLBACK: '/auth/callback',
    TEACHER_STUDENT_LOGIN: '/login',
    VERIFY_OTP:            '/auth/verify-otp',
    FORGOT_PASSWORD:       '/auth/forgot-password',
    RESET_PASSWORD:        '/auth/reset-password',
    FIRST_TIME_SETUP:      '/auth/first-time-setup',
    UNAUTHORIZED:          '/unauthorized',
  },
  ADMIN: {
    ROOT:        '/admin',
    DASHBOARD:   '/admin/dashboard',
    TEACHERS:    '/admin/teacher',
    // STUDENTS:    '/admin/students',
    MANAGER:    '/admin/manager',
    CLASSES:     '/admin/classes',
    DEPARTMENTS: '/admin/departments',
    SUBJECTS:    '/admin/subjects',
    EXAMS:       '/admin/exams',
    ANALYTICS:   '/admin/analytics',
    SETTINGS:    '/admin/settings',
  },
  MANAGER: {
    ROOT:        '/manager',
    DASHBOARD:   '/manager/dashboard',
    TEACHERS:    '/manager/teachers',
    STUDENTS:    '/manager/students',
    CLASSES:     '/manager/classes',
    SUBJECTS:    '/manager/subjects',
    DEPARTMENTS: '/manager/departments',
    EXAMS:       '/manager/exams',
    ANALYTICS:   '/manager/analytics',
    LEADERBOARD: '/manager/leaderboard',
    TASKS:       '/manager/tasks',
  },
  TEACHER: {
    ROOT:        '/teacher',
    DASHBOARD:   '/teacher/dashboard',
    CLASSES:     '/teacher/classes',
    ATTENDANCE:  '/teacher/attendance',
    MARKS:       '/teacher/marks',
    ASSIGNMENTS: '/teacher/assignments',
    STUDENTS:    '/teacher/students',
  },
  STUDENT: {
    ROOT:        '/student',
    DASHBOARD:   '/student/dashboard',
    PERFORMANCE: '/student/performance',
    ATTENDANCE:  '/student/attendance',
    RESULTS:     '/student/results',
    ASSIGNMENTS: '/student/assignments',
  },
} as const

export interface NavItem {
  label: string
  path:  string
  icon:  LucideIcon
}

export const ADMIN_NAV: NavItem[] = [
  { label: 'Dashboard',   path: ROUTES.ADMIN.DASHBOARD,   icon: LayoutDashboard },
  { label: 'Manager',    path: ROUTES.ADMIN.MANAGER,    icon: Users   },
  { label: 'Teacher',    path: ROUTES.ADMIN.TEACHERS,    icon: Users },
  // { label: 'Students',    path: ROUTES.ADMIN.STUDENTS,    icon: GraduationCap   },
  { label: 'Classes',     path: ROUTES.ADMIN.CLASSES,     icon: School          },
  { label: 'Departments', path: ROUTES.ADMIN.DEPARTMENTS, icon: Building2       },
  { label: 'Subjects',    path: ROUTES.ADMIN.SUBJECTS,    icon: BookOpen        },
  { label: 'Exams',       path: ROUTES.ADMIN.EXAMS,       icon: ClipboardList   },
  { label: 'Analytics',   path: ROUTES.ADMIN.ANALYTICS,   icon: BarChart3       },
  { label: 'Settings',    path: ROUTES.ADMIN.SETTINGS,    icon: Settings        },
]

export const MANAGER_NAV: NavItem[] = [
  { label: 'Dashboard',   path: ROUTES.MANAGER.DASHBOARD,   icon: LayoutDashboard },
  // { label: 'Students',    path: ROUTES.MANAGER.STUDENTS,    icon: GraduationCap   },
  { label: 'Teachers',    path: ROUTES.MANAGER.TEACHERS,    icon: Users           },
  { label: 'Classes',     path: ROUTES.MANAGER.CLASSES,     icon: School          },
  { label: 'Subjects',    path: ROUTES.MANAGER.SUBJECTS,    icon: BookOpen        },
  { label: 'Departments', path: ROUTES.MANAGER.DEPARTMENTS, icon: Building2       },
  { label: 'Exams',       path: ROUTES.MANAGER.EXAMS,       icon: ClipboardList   },
  // { label: 'Analytics',   path: ROUTES.MANAGER.ANALYTICS,   icon: BarChart3       },
  // { label: 'Leaderboard', path: ROUTES.MANAGER.LEADERBOARD, icon: Trophy          },
  // { label: 'Tasks',       path: ROUTES.MANAGER.TASKS,       icon: Calendar        },
]

export const TEACHER_NAV: NavItem[] = [
  { label: 'Dashboard',   path: ROUTES.TEACHER.DASHBOARD,   icon: LayoutDashboard },
  { label: 'My Classes',  path: ROUTES.TEACHER.CLASSES,     icon: School          },
  { label: 'Attendance',  path: ROUTES.TEACHER.ATTENDANCE,  icon: CheckSquare     },
  { label: 'Marks',       path: ROUTES.TEACHER.MARKS,       icon: FileText        },
  { label: 'Assignments', path: ROUTES.TEACHER.ASSIGNMENTS, icon: ClipboardList   },
  { label: 'Students',    path: ROUTES.TEACHER.STUDENTS,    icon: Users           },
]

export const STUDENT_NAV: NavItem[] = [
  { label: 'Dashboard',   path: ROUTES.STUDENT.DASHBOARD,   icon: LayoutDashboard },
  { label: 'Performance', path: ROUTES.STUDENT.PERFORMANCE, icon: TrendingUp      },
  { label: 'Attendance',  path: ROUTES.STUDENT.ATTENDANCE,  icon: CheckSquare     },
  { label: 'Results',     path: ROUTES.STUDENT.RESULTS,     icon: FileText        },
  { label: 'Assignments', path: ROUTES.STUDENT.ASSIGNMENTS, icon: ClipboardList   },
]

export const NAV_BY_ROLE: Record<Role, NavItem[]> = {
  [ROLES.ADMIN]:   ADMIN_NAV,
  [ROLES.MANAGER]: MANAGER_NAV,
  [ROLES.TEACHER]: TEACHER_NAV,
  [ROLES.STUDENT]: STUDENT_NAV,
}