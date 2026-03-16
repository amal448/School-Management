// src/application/use-cases/auth/change-password.use-case.ts
import { IUseCase } from '../interfaces/use-case.interface';
import { IPasswordHasher, ILogger } from '../../ports/services/index';
import { AppError } from '../../../shared/types/app-error';
import { Role } from '../../../domain/enums/index';
import { ChangePasswordDto } from '../../../domain/dtos/auth.dto';
import { IManagerRepository } from '../../ports/repositories/manager.repository.interface';
import { ITeacherRepository } from '../../ports/repositories/teacher.repository.interface';
import { IStudentRepository } from '../../ports/repositories/student.repository.interface';

export interface ChangePasswordInput extends ChangePasswordDto {
  userId: string;
  role: Role;
}

export class ChangePasswordUseCase implements IUseCase<ChangePasswordInput, void> {
  constructor(
    private readonly managerRepo: IManagerRepository,
    private readonly teacherRepo: ITeacherRepository,
    private readonly studentRepo: IStudentRepository,
    private readonly passwordHasher: IPasswordHasher,
    private readonly logger: ILogger,
  ) {}

  async execute(input: ChangePasswordInput): Promise<void> {
    const { entity, repo } = await this.resolveUser(input.userId, input.role);
    if (!entity) throw AppError.notFound('User not found');

    const valid = await this.passwordHasher.compare(input.currentPassword, entity.passwordHash);
    if (!valid) throw AppError.unauthorized('Current password is incorrect');

    const newHash = await this.passwordHasher.hash(input.newPassword);
    entity.updatePassword(newHash);
    await repo.update(entity.id!, entity as any);

    this.logger.info('ChangePasswordUseCase: updated', { userId: entity.id, role: input.role });
  }

  private async resolveUser(userId: string, role: Role) {
    switch (role) {
      case Role.MANAGER: return { entity: await this.managerRepo.findById(userId), repo: this.managerRepo };
      case Role.TEACHER: return { entity: await this.teacherRepo.findById(userId), repo: this.teacherRepo };
      case Role.STUDENT: return { entity: await this.studentRepo.findById(userId), repo: this.studentRepo };
      default: throw AppError.badRequest('Invalid role');
    }
  }
}
