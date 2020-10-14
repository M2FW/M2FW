import { ObjectType } from 'typeorm'
import { IInsertBaseController } from './IInsertBaseController'
import { IDeleteBaseController } from './IDeleteBaseController'
import { IReadBaseController } from './IReadBaseController'
import { IUpdateBaseController } from './IUpdateBaseController'

export interface IBaseController<T>
  extends IReadBaseController<T>,
    IInsertBaseController<T>,
    IUpdateBaseController<T>,
    IDeleteBaseController<T> {
  entity: ObjectType<T>
}

export interface IListResult<T> {
  items: T[]
  total: number
}
