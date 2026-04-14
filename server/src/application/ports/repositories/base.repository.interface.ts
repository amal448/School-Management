export interface PaginationOptions {
  page?:  number
  limit?: number
}

export interface PaginatedResult<T> {
  data:       T[]
  total:      number
  page:       number
  limit:      number
  totalPages: number
}

export interface IBaseRepository<TEntity, TQuery extends PaginationOptions = PaginationOptions> {
  save(entity: TEntity):                          Promise<TEntity>
  findById(id: string):                           Promise<TEntity | null>
  findAll(query: TQuery):                         Promise<PaginatedResult<TEntity>>
  update(id: string, entity: TEntity):            Promise<TEntity | null>
  delete(id: string):                             Promise<void>
  existsById(id: string):                         Promise<boolean>
}