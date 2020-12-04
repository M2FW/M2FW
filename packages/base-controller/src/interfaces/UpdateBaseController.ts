import { UpdateResult } from 'typeorm'

export interface UpdateBaseController<T> {
  update(data: T | T[]): Promise<UpdateResult | UpdateResult[]>
}
