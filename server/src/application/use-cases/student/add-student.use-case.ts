import { Student } from "@domain/entities/student.entity";
import { IAddStudentUseCase } from "../interfaces/create-student.user-case.interface";
import { IStudentRepository } from "@application/ports/repositories/student.repository.interface";
import { IPasswordHasher } from "@application/ports/services/password-hasher.service.interface";
import { UserErrorType } from "@domain/enums/user-error-type.enum"; // Added this

export class AddStudentUseCase implements IAddStudentUseCase {
  constructor(
    private readonly studentRepo: IStudentRepository,
    private readonly passwordHasher: IPasswordHasher 
  ) {}

  async execute(dto: any): Promise<void> {
    // 1. Business Rule: Check if student already exists by email
    const existing = await this.studentRepo.findByEmail(dto.email);
    if (existing) {
      throw new Error(UserErrorType.USER_ALREADY_EXISTS);
    }

    // 2. Security: Hash the temporary password
    const hashedTempPassword = await this.passwordHasher.hash(dto.tempPassword);

    // 3. Entity Creation: Logic is isolated in the Domain
    const student = new Student(
      crypto.randomUUID(),
      dto.name,
      dto.teacherId,
      [],
      hashedTempPassword 
    );

    // 4. Persistence
    await this.studentRepo.save(student);
  }
}