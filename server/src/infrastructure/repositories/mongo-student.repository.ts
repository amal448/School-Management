import { IStudentRepository } from "@application/ports/repositories/student.repository.interface";
import { Student } from "@domain/entities/student.entity";
import { StudentModel } from "@infrastructure/database/models/student.model";

export class MongoStudentRepository implements IStudentRepository {
    
    async save(student: Student): Promise<void> {
        const data = {
            _id: student.id,
            name: student.name,
            teacherId: student.teacherId,
            progressReports: student.progressReports,
            password: student.getPassword()
        }
        await StudentModel.findOneAndUpdate({ _id: student.id }, data, { upsert: true })
    }

    async findByTeacherId(teacherId: string): Promise<Student[]> {
        const docs = await StudentModel.find({ teacherId })
        return docs.map(doc => new Student(doc._id, doc.name, doc.teacherId, doc.progressReports, doc.password))
    }

    async findById(id: string): Promise<Student | null> {
        const doc = await StudentModel.findById(id);
        if (!doc) return null;
        return new Student(doc._id, doc.name, doc.teacherId, doc.progressReports, doc.password);
    }


}