import { AuthTokensDto, LoginDto } from "../../../domain/dtos/auth.dto";
import { Role } from "../../../domain/enums";
import { AppError } from "../../../shared/types/app-error";
import { ManagerMapper, StudentMapper, TeacherMapper } from "../../mappers";
import { IManagerRepository } from "../../ports/repositories/manager.repository.interface";
import { IStudentRepository } from "../../ports/repositories/student.repository.interface";
import { ITeacherRepository } from "../../ports/repositories/teacher.repository.interface";
import { ILogger, IPasswordHasher, ITokenService } from "../../ports/services";
import { IUseCase } from "../interfaces/use-case.interface";

export class LoginUseCase implements IUseCase<LoginDto, AuthTokensDto> {
  constructor(
    private readonly managerRepo: IManagerRepository,
    private readonly teacherRepo: ITeacherRepository,
    private readonly studentRepo: IStudentRepository,
    private readonly passwordHasher: IPasswordHasher,
    private readonly tokenService: ITokenService,
    private readonly logger: ILogger,
  ) {}

  async execute(dto: LoginDto): Promise<AuthTokensDto> {
    this.logger.info('LoginUseCase', { email: dto.email, role: dto.role });

    const { entity, role } = await this.resolveUser(dto.email, dto.role);

    if (!entity || !entity.isActive) {
      throw AppError.unauthorized('Invalid credentials');
    }

    const valid = await this.passwordHasher.compare(dto.password, entity.passwordHash);
    if (!valid) throw AppError.unauthorized('Invalid credentials');

    const tokens = this.tokenService.generateTokenPair({
      userId: entity.id!,
      email: entity.email,
      role,
    });

    const user = role === Role.MANAGER
      ? ManagerMapper.toDto(entity as any)
      : role === Role.TEACHER
        ? TeacherMapper.toDto(entity as any)
        : StudentMapper.toDto(entity as any);

    this.logger.info('LoginUseCase: success', { id: entity.id, role });
    return { ...tokens, user };
  }

private async resolveUser(email: string, role: string) {
  switch (role) {
    case Role.ADMIN:
      // Admins log in via Google OAuth, not this endpoint
      throw AppError.badRequest(
        'Admin accounts use Google Sign-In. Use /api/auth/google'
      );
    case Role.MANAGER:
      return { entity: await this.managerRepo.findByEmail(email), role: Role.MANAGER };
    case Role.TEACHER:
      return { entity: await this.teacherRepo.findByEmail(email), role: Role.TEACHER };
    case Role.STUDENT:
      return { entity: await this.studentRepo.findByEmail(email), role: Role.STUDENT };
    default:
      throw AppError.badRequest('Invalid role');
  }
}
}
