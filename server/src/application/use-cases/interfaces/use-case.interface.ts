// src/application/use-cases/interfaces/use-case.interface.ts
export interface IUseCase<TInput, TOutput> {
  execute(input: TInput): Promise<TOutput>
}

// Void use case — no return value
export interface IVoidUseCase<TInput> {
  execute(input: TInput): Promise<void>
}

// Query use case — no side effects
export interface IQueryUseCase<TInput, TOutput> {
  execute(input: TInput): Promise<TOutput>
}