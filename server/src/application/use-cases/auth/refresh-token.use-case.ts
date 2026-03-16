import { AuthTokensDto, RefreshTokenDto } from "../../../domain/dtos/auth.dto";
import { Role } from "../../../domain/enums";
import { AppError } from "../../../shared/types/app-error";
import { ManagerMapper, StudentMapper, TeacherMapper } from "../../mappers";
import { IManagerRepository } from "../../ports/repositories/manager.repository.interface";
import { IStudentRepository } from "../../ports/repositories/student.repository.interface";
import { ITeacherRepository } from "../../ports/repositories/teacher.repository.interface";
import { ILogger, ITokenService } from "../../ports/services";
import { IUseCase } from "../interfaces/use-case.interface";

export class RefreshTokenUseCase implements IUseCase<RefreshTokenDto, AuthTokensDto> {
  constructor(
    private readonly managerRepo: IManagerRepository,
    private readonly teacherRepo: ITeacherRepository,
    private readonly studentRepo: IStudentRepository,
    private readonly tokenService: ITokenService,
    private readonly logger: ILogger,
  ) {}

  async execute(dto: RefreshTokenDto): Promise<AuthTokensDto> {
    let payload;
    try {
      payload = this.tokenService.verifyRefreshToken(dto.refreshToken);
    } catch {
      throw AppError.unauthorized('Invalid or expired refresh token');
    }

    const { entity, role } = await this.resolveUser(payload.userId, payload.role);
    if (!entity || !entity.isActive) {
      throw AppError.notFound('User not found or inactive');
    }

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

    this.logger.info('RefreshTokenUseCase: rotated', { userId: entity.id, role });
    return { ...tokens, user };
  }

  private async resolveUser(userId: string, role: Role) {
    switch (role) {
      case Role.MANAGER: return { entity: await this.managerRepo.findById(userId), role: Role.MANAGER };
      case Role.TEACHER: return { entity: await this.teacherRepo.findById(userId), role: Role.TEACHER };
      case Role.STUDENT: return { entity: await this.studentRepo.findById(userId), role: Role.STUDENT };
      default: throw AppError.badRequest('Invalid role in token');
    }
  }
}