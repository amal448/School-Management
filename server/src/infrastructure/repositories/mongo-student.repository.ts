import { StudentPersistenceMapper } from "@application/mappers/user.mapper";
import { IStudentRepository } from "@application/ports/repositories/student.repository.interface";
import { Student } from "@domain/entities/student.entity";
import { StudentModel } from "@infrastructure/database/models/student.model";

export class MongoStudentRepository implements IStudentRepository {

    async save(student: Student): Promise<void> {
        // Use the mapper to "mold" the data for Mongo
        const data = StudentPersistenceMapper.toPersistence(student);
        await StudentModel.findOneAndUpdate({ _id: student.id }, data, { upsert: true });
    }

    async findByTeacherId(teacherId: string): Promise<Student[]> {
        const docs = await StudentModel.find({ teacherId });
        // Use the mapper to "mold" the docs back into Domain Entities
        return docs.map(StudentPersistenceMapper.toDomain);
    }

    async findById(id: string): Promise<Student | null> {
        const doc = await StudentModel.findById(id);
        return doc ? StudentPersistenceMapper.toDomain(doc) : null;
    }
    
    async findByEmail(email: string): Promise<Student | null> {
        const doc = await StudentModel.find({ email });
        return doc ? StudentPersistenceMapper.toDomain(doc) : null;
    }
}