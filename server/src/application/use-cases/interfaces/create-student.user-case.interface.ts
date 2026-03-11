export interface IAddStudentUseCase {
  execute(dto: any): Promise<void>;
}