import { Student } from "@domain/entities/student.entity";
import { IAddStudentUseCase } from "../interfaces/create-student.user-case.interface";
import { IStudentRepository } from "@application/ports/repositories/student.repository.interface";
// Add this import
import { IPasswordHasher } from "@application/ports/services/password-hasher.service.interface";

export class AddStudentUseCase implements IAddStudentUseCase {
  // Update constructor to accept 2 arguments
  constructor(
    private readonly studentRepo: IStudentRepository,
    private readonly passwordHasher: IPasswordHasher // Now it matches app.ts!
  ) {}

  async execute(dto: any): Promise<void> {
    // Optional: Use the hasher for the tempPassword
    const hashedTempPassword = await this.passwordHasher.hash(dto.tempPassword);

    const student = new Student(
      crypto.randomUUID(),
      dto.name,
      dto.teacherId,
      [],
      hashedTempPassword // Using the hashed version
    );

    await this.studentRepo.save(student);
  }
}