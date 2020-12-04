import { DeleteBaseController } from './DeleteBaseController'
import { InsertBaseController } from './InsertBaseController'
import { ObjectType } from 'typeorm'
import { ReadBaseController } from './ReadBaseController'
import { UpdateBaseController } from './UpdateBaseController'

export interface BaseController<T>
  extends ReadBaseController<T>,
    InsertBaseController<T>,
    UpdateBaseController<T>,
    DeleteBaseController<T> {
  entity: ObjectType<T>
}

export interface ListResult<T> {
  items: T[]
  total: number
}
