import { InsertResult } from 'typeorm'

export interface InsertBaseController<T> {
  insert(data: T | T[]): Promise<InsertResult | InsertResult[]>
}
