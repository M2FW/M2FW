import { InsertResult } from 'typeorm'

export interface IInsertBaseController<T> {
  insert(data: T | T[]): Promise<InsertResult | InsertResult[]>
}
