import { ExamEntity }    from 'src/domain/entities/exam.entity'
import { ExamQueryDto }  from 'src/domain/dtos/exam.dto'
import { PaginatedResult } from 'src/shared/types/Pagination-type'

export interface IExamRepository {
  save(exam: ExamEntity):                       Promise<ExamEntity>
  update(id: string, exam: ExamEntity):         Promise<ExamEntity | null>
  findById(id: string):                         Promise<ExamEntity | null>
  findAll(query: ExamQueryDto):                 Promise<PaginatedResult<ExamEntity>>
}