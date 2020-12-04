import { DeleteResult } from 'typeorm'

export interface DeleteBaseController<T> {
  delete(data: string[] | number[] | string | number): Promise<DeleteResult>
}
