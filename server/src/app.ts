import express from 'express'
import { StudentRoutes } from '@interfaces/routes/student.routes'
import { AddStudentUseCase } from '@application/use-cases/student/add-student.use-case'
import { StudentController } from '@interfaces/controllers/create-student.controller'
import { MongoStudentRepository } from '@infrastructure/repositories/mongo-student.repository'
import { BcryptPasswordService } from '@infrastructure/services/bcrypt-password-hasher.service'

const app = express();
app.use(express.json())
// 1. Setup Infrastructure
const studentRepo = new MongoStudentRepository();
const passwordService = new BcryptPasswordService();

// 2. Setup Use Cases
// FIX: Ensure the constructor in AddStudentUseCase accepts BOTH repo and service
// AND use the 'new' keyword to create an instance.
const addStudentUseCase = new AddStudentUseCase(studentRepo, passwordService);

// 3. Setup Controllers
// Pass the instance (addStudentUseCase), not the class (AddStudentUseCase)
const studentController = new StudentController(addStudentUseCase);

app.use('/api/students', StudentRoutes(studentController));
export default app;