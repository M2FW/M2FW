import { QueryOperators } from '../enums'

export interface ComparableValues {
  a: any
  b: any
}

export interface WhereObject {
  operator: QueryOperators
  value: ComparableValues | string | number
}

export interface OrderObject {
  [field: string]: 'ASC' | 'DESC'
}

export interface FindOptions<T> {
  select?: (keyof T)[]
  order?: { [P in keyof T]?: 'ASC' | 'DESC' }
  skip?: number
  take?: number
  relations?: string[]
}

export interface QueryCondition<T> extends FindOptions<T> {
  where?: T | any
}
