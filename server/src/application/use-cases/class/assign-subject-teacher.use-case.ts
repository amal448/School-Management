import { ClassResponseDto } from "src/domain/dtos/class.dto"
import { IUseCase } from "../interfaces/use-case.interface"
import { IClassRepository } from "src/application/ports/repositories/class.repository.interface"
import { ILogger } from "src/application/ports/services"
import { AppError } from "src/shared/types/app-error"
import { ClassMapper } from "src/application/mappers"

export interface AssignSubjectTeacherInput {
    classId: string
    subjectId: string
    teacherId: string
}

export class AssignSubjectTeacherUseCase implements IUseCase<AssignSubjectTeacherInput, ClassResponseDto> {
    constructor(
        private readonly classRepo: IClassRepository,
        private readonly logger: ILogger
    ) { }
    async execute(input: AssignSubjectTeacherInput): Promise<ClassResponseDto> {
        const cls = await this.classRepo.findById(input.classId)
        if (!cls) throw AppError.notFound('Class not Found')

        const hasSubject = cls.subjectAllocations.some(a => a.subjectId === input.subjectId)
        if (!hasSubject) {
            throw AppError.badRequest('Subject is not allocated to this class')
        }

        const updated = await this.classRepo.assignSubjectTeacher(
            input.classId,
            input.subjectId,
            input.teacherId
        )
        if (!updated) throw AppError.internal('Assignment failed')

        this.logger.info('AssignSubjectTeacherUseCase : assigned', input)
        return ClassMapper.toDto(updated)
    }
}