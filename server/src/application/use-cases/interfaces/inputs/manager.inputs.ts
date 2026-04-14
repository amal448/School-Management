// src/application/use-cases/interfaces/inputs/manager.inputs.ts

import {
  CreateManagerDto,   // ← was RegisterManagerDto (wrong name)
  UpdateManagerDto,
} from 'src/domain/dtos/manager.dto'

export interface CreateManagerInput {
  dto:            CreateManagerDto   // ← was RegisterManagerDto
  createdByAdmin: string
}

export interface UpdateManagerInput {
  id:  string
  dto: UpdateManagerDto
}

export interface BlockManagerInput {
  managerId: string
  adminId:   string
  reason?:   string
}

export interface UnblockManagerInput {
  managerId: string
  adminId:   string
}