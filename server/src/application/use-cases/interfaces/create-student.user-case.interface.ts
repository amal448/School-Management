export interface ICreateStudentUseCase {
  execute(dto: any): Promise<void>;
}