import { AuthTokensDto } from "../../../domain/dtos/auth.dto";
import { RegisterManagerDto } from "../../../domain/dtos/manager.dto";
import { ManagerEntity } from "../../../domain/entities/manager.entity";
import { Role } from "../../../domain/enums";
import { AppError } from "../../../shared/types/app-error";
import { ManagerMapper } from "../../mappers";
import { IManagerRepository } from "../../ports/repositories/manager.repository.interface";
import { ILogger, IPasswordHasher, ITokenService } from "../../ports/services";
import { IUseCase } from "../interfaces/use-case.interface";

// ── Register Manager ────────────────────────   ───────────
export class RegisterManagerUseCase implements IUseCase<RegisterManagerDto, AuthTokensDto> {
  constructor(
    private readonly managerRepo: IManagerRepository,
    private readonly passwordHasher: IPasswordHasher,
    private readonly tokenService: ITokenService,
    private readonly logger: ILogger,
  ) {}

  async execute(dto: RegisterManagerDto): Promise<AuthTokensDto> {
    const exists = await this.managerRepo.existsByEmail(dto.email);
    if (exists) throw AppError.conflict('Email is already registered');

    const passwordHash = await this.passwordHasher.hash(dto.password);
    const manager = ManagerEntity.create({ ...dto, passwordHash });
    const saved = await this.managerRepo.save(manager);

    const tokens = this.tokenService.generateTokenPair({
      userId: saved.id!,
      email: saved.email,
      role: Role.MANAGER,
    });

    this.logger.info('RegisterManagerUseCase: created', { id: saved.id });
    return { ...tokens, user: ManagerMapper.toDto(saved) };
  }
}
