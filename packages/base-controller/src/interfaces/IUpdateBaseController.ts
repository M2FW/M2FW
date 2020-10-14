import { UpdateResult } from 'typeorm'

export interface IUpdateBaseController<T> {
  update(data: T | T[]): Promise<UpdateResult | UpdateResult[]>
}
