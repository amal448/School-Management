import { useQuery } from '@tanstack/react-query'
import { statsApi } from '@/api/stats.api'

export const useOverviewStats = () =>
    useQuery({
        queryKey: ['stats', 'overview'],
        queryFn: () => statsApi.getOverview(),
        staleTime: 1000 * 60 * 5,
    })

export const useGradePerformance = (
    grade?: string,
    examType?: string,
) =>
    useQuery({
        queryKey: ['stats', 'grade-performance', grade, examType],
        queryFn: () => statsApi.getGradePerformance({ grade, examType }),
        enabled: !!grade,
        staleTime: 1000 * 60 * 5,
    })

export const useStudentStats = (studentId: string) =>
    useQuery({
        queryKey: ['stats', 'student', studentId],
        queryFn: () => statsApi.getStudentStats(studentId),
        enabled: !!studentId,
        staleTime: 1000 * 60 * 5,
    })