import { QueryOperators } from '../enums'

export interface IComparableValues {
  a: any
  b: any
}

export interface IWhereObject {
  operator: QueryOperators
  value: IComparableValues | string | number
}

export interface IOrderObject {
  [field: string]: 'ASC' | 'DESC'
}

export interface IFindOptions<T> {
  select?: (keyof T)[]
  order?: { [P in keyof T]?: 'ASC' | 'DESC' }
  skip?: number
  take?: number
  relations?: string[]
}

export interface IQueryCondition<T> extends IFindOptions<T> {
  where?: T | any
}
