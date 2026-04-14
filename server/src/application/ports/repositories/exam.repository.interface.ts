// src/application/ports/repositories/exam.repository.interface.ts

import { IBaseRepository }  from './base.repository.interface'
import { ExamEntity }        from 'src/domain/entities/exam.entity'
import { ExamQueryDto }      from 'src/domain/dtos/exam.dto'

export interface IExamRepository
  extends IBaseRepository<ExamEntity, ExamQueryDto> {
}