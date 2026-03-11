import { Student } from "@domain/entities/student.entity";

export interface IStudentRepository {
    save(student: Student): Promise<void>
    findById(id: string): Promise<Student | null>;
    // findByEmail(email: string): Promise<Student | null>;
    findByTeacherId(teacherId: string): Promise<Student[]>;

    //   Updates specific fields of a student (e.g., adding a progress report)
    // update(id: string, student: Partial<Student>): Promise<void>;
    //   Removes a student from the system
    // delete(id: string): Promise<void>;
}