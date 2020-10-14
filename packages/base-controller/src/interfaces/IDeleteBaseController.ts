import { DeleteResult } from 'typeorm'

export interface IDeleteBaseController<T> {
  delete(data: string[] | number[] | string | number): Promise<DeleteResult>
}
