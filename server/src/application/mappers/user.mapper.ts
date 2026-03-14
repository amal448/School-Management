import { Student } from "@domain/entities/user.entity";

export class StudentPersistenceMapper {
  // From Domain to MongoDB
  static toPersistence(student: Student) {
    return {
      _id: student.id,
      name: student.name,
      teacherId: student.teacherId,
      progressReports: student.progressReports,
      password: student.getPassword()
    };
  }

  // From MongoDB to Domain
  static toDomain(doc: any): Student {
    return new Student(
      doc._id,
      doc.name,
      doc.teacherId,
      doc.progressReports,
      doc.password
    );
  }
}