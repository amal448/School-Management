import apiClient from './client'
import { ApiResponse } from '@/types/api.types'
import { ENDPOINTS } from '@/constants/endpoints'

export interface OverviewStats {
    totalTeachers: number
    totalStudents: number
    totalDepartments: number
}

export interface SubjectAverage {
    subjectId: string
    average: number
}

export interface GradePerformance {
    examCount: number
    subjectAverages: SubjectAverage[]
    exams: Array<{ id: string; examName: string; examType: string }>
}

export interface StudentStats {
    overall: number
    bySubject: Array<{ subjectId: string; average: number }>
    byExam: Array<{ examId: string; percentage: number }>
}

export const statsApi = {
    getOverview: async (): Promise<OverviewStats> => {
        const res = await apiClient.get<ApiResponse<OverviewStats>>(
            ENDPOINTS.STATS.OVERVIEW
        )
        return res.data.data!
    },

    getGradePerformance: async (params: {
        grade?: string
        examType?: string
    }): Promise<GradePerformance> => {
        const res = await apiClient.get<ApiResponse<GradePerformance>>(
            ENDPOINTS.STATS.GRADE_PERFORMANCE, { params }
        )
        return res.data.data!
    },

    getStudentStats: async (studentId: string): Promise<StudentStats> => {
        const res = await apiClient.get<ApiResponse<StudentStats>>(
            ENDPOINTS.STATS.STUDENT(studentId)
        )
        return res.data.data!
    },
}