import { Request, Response } from "express";
import { IAddStudentUseCase } from "@application/use-cases/interfaces/create-student.user-case.interface"
import { CreateStudentDTO } from "@domain/dtos/student.dto";

export class StudentController {

    constructor(private addStudentUseCase: IAddStudentUseCase) { }
    
    async createStudent(req: Request, res: Response): Promise<void> {
        const dto: CreateStudentDTO = req.body
        
        await this.addStudentUseCase.execute(dto)
        res.status(201).json({ message: "Student created" })

    }
}