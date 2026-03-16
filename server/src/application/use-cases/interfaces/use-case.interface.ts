// src/application/use-cases/interfaces/use-case.interface.ts
export interface IUseCase<TInput, TOutput> {
  execute(input: TInput): Promise<TOutput>;
}