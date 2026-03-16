import { AuthTokensDto } from "../../../domain/dtos/auth.dto";
import { RegisterStudentDto } from "../../../domain/dtos/student.dto";
import { StudentEntity } from "../../../domain/entities/student.entity";
import { Role } from "../../../domain/enums";
import { AppError } from "../../../shared/types/app-error";
import { StudentMapper } from "../../mappers";
import { IStudentRepository } from "../../ports/repositories/student.repository.interface";
import { ILogger, IPasswordHasher, ITokenService } from "../../ports/services";
import { IUseCase } from "../interfaces/use-case.interface";

export class RegisterStudentUseCase implements IUseCase<RegisterStudentDto, AuthTokensDto> {
    constructor(
        private readonly studentRepo: IStudentRepository,
        private readonly passwordHasher: IPasswordHasher,
        private readonly tokenService: ITokenService,
        private readonly logger: ILogger,
    ){}

  async execute(dto: RegisterStudentDto): Promise<AuthTokensDto> {
    const exists = await this.studentRepo.existsByEmail(dto.email);
    if (exists) throw AppError.conflict('Email is already registered');

    const passwordHash = await this.passwordHasher.hash(dto.password);
    const student = StudentEntity.create({ ...dto, passwordHash });
    const saved = await this.studentRepo.save(student);

    const tokens = this.tokenService.generateTokenPair({
      userId: saved.id!,
      email: saved.email,
      role: Role.STUDENT,
    });

    this.logger.info('RegisterStudentUseCase: created', { id: saved.id });
    return { ...tokens, user: StudentMapper.toDto(saved) };
  }







}