import { QueryCondition } from './QueryCondition'

export interface ReadBaseController<T> {
  findOne(queryCondition?: QueryCondition<T> | string): Promise<T | undefined>
  find(
    queryCondition?: QueryCondition<T>
  ): Promise<{ items: T[]; total: number } | T[]>
}
