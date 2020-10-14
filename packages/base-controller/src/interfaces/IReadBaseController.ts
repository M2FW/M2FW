import { IQueryCondition } from './IQueryCondition'

export interface IReadBaseController<T> {
  findOne(queryCondition?: IQueryCondition<T> | string): Promise<T | undefined>
  find(
    queryCondition?: IQueryCondition<T>
  ): Promise<{ items: T[]; total: number } | T[]>
}
