import { CreateManagerDto, ManagerResponseDto } from "src/domain/dtos/manager.dto";
import { ManagerEntity } from "../../../domain/entities/manager.entity";
import { AppError } from "../../../shared/types/app-error";
import { ManagerMapper } from "../../mappers";
import { IManagerRepository } from "../../ports/repositories/manager.repository.interface";
import { ILogger, IPasswordHasher } from "../../ports/services";
import { IUseCase } from "../interfaces/use-case.interface";


export interface CreateManagerInput {
  dto: CreateManagerDto
  createdByAdmin: string
}

export class CreateManagerUseCase
  implements IUseCase<CreateManagerInput, ManagerResponseDto> {

  constructor(
    private readonly managerRepo: IManagerRepository,
    private readonly passwordHasher: IPasswordHasher,
    private readonly logger: ILogger,
  ) { }

  async execute(input: CreateManagerInput): Promise<ManagerResponseDto> {
    const exists = await this.managerRepo.existsByEmail(input.dto.email)
    if (exists) {
      throw AppError.conflict('A manager with this email already exists')
    }

    //  Hash the temporary password
    const passwordHash = await this.passwordHasher.hash(input.dto.password)

    // 3. Build domain entity — business rules enforced here
    const manager = ManagerEntity.create({
      email: input.dto.email,
      passwordHash,
      firstName: input.dto.firstName,
      lastName: input.dto.lastName,
      phone: input.dto.phone,
      createdByAdmin: input.createdByAdmin,
      isFirstTime: true,    // must change password on first login
      isVerified: false,   // not verified until first login
      isActive: true,
      isBlocked: false,
    })

    // 4. Persist
    const saved = await this.managerRepo.save(manager)

    this.logger.info('CreateManagerUseCase: manager created', {
      id: saved.id,
      email: saved.email,
      createdByAdmin: input.createdByAdmin,
    })

    return ManagerMapper.toDto(saved)
  }
}
