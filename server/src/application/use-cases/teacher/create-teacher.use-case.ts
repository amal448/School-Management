import { ITeacherRepository } from "@application/ports/repositories/teacher.repository.interface";
import { IPasswordHasher } from "@application/ports/services/password-hasher.service.interface";
import { CreateTeacherDto } from "@domain/dtos/teacher.dto";
import { Teacher } from "@domain/entities/teacher.entity";

export class CreateTeacherUseCase {
    constructor(
        private readonly teacherRepo:ITeacherRepository,
        private readonly hasher:IPasswordHasher
    ){}

    async execute(dto:CreateTeacherDto):Promise<void>{
        const hashedPassword=await this.hasher.hash(dto.password);

        const teacher=new Teacher(
            crypto.randomUUID(),
            dto.name,
            dto.email,
            dto.assignedClassId || null,
            hashedPassword
        )
        await this.teacherRepo.save(teacher)

    }




}