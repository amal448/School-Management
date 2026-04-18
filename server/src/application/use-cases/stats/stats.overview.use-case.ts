import { ITeacherRepository } from 'src/application/ports/repositories/teacher.repository.interface'
import { IStudentRepository } from 'src/application/ports/repositories/student.repository.interface'
import { IDepartmentRepository } from 'src/application/ports/repositories/department.repository.interface'
import { IUseCase } from '../interfaces/use-case.interface'

export class StatsOverviewUseCase implements IUseCase<void, any> {
    constructor(
        private readonly teacherRepo: ITeacherRepository,
        private readonly studentRepo: IStudentRepository,
        private readonly deptRepo: IDepartmentRepository,
    ) {}

    async execute(): Promise<any> {
        const [teachers, students, departments] = await Promise.all([
            this.teacherRepo.findAll({ limit: 1, isActive: true } as any),
            this.studentRepo.findAll({ limit: 1, isActive: true } as any),
            this.deptRepo.findAll({ limit: 1 } as any),
        ])

        return {
            totalTeachers: teachers.total,
            totalStudents: students.total,
            totalDepartments: departments.total,
        }
    }
}
