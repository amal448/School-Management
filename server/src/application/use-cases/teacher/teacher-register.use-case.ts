import { IUseCase } from "../interfaces/use-case.interface";
import { RegisterTeacherDto, UpdateTeacherDto, TeacherQueryDto, TeacherResponseDto, PaginatedTeachersDto } from "../../../domain/dtos/teacher.dto";
import { AuthTokensDto } from "../../../domain/dtos/auth.dto";
import { TeacherEntity } from "../../../domain/entities/teacher.entity";
import { Role } from "../../../domain/enums";
import { ITeacherRepository } from "../../ports/repositories/teacher.repository.interface";
import { ILogger, IPasswordHasher, ITokenService } from "../../ports/services";
import { AppError } from "../../../shared/types/app-error";
import { TeacherMapper } from "../../mappers";


export class RegisterTeacherUseCase implements IUseCase<RegisterTeacherDto, AuthTokensDto> {
    constructor(
        private  readonly teacherRepo:ITeacherRepository,
        private readonly passwordHasher:IPasswordHasher,
        private readonly tokenService:ITokenService,
        private readonly logger:ILogger
    ) { }
    
    async execute(dto: RegisterTeacherDto): Promise<AuthTokensDto> {
        const exists = await this.teacherRepo.existsByEmail(dto.email);
        if (exists) throw AppError.conflict('Email is already registered');

        const passwordHash = await this.passwordHasher.hash(dto.password);
        const teacher = TeacherEntity.create({ ...dto, passwordHash });
        const saved = await this.teacherRepo.save(teacher);

        const tokens = this.tokenService.generateTokenPair({
            userId: saved.id!,
            email: saved.email,
            role: Role.TEACHER,
        });

        this.logger.info('RegisterTeacherUseCase: created', { id: saved.id });
        return { ...tokens, user: TeacherMapper.toDto(saved) };
    }
}