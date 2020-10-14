import { BaseColumnConfigInterface } from './BaseColumnConfigInterface'

export interface SelectColumnConfigInterface extends BaseColumnConfigInterface {
  options?: string[] | SelectOptionInterface[]
}

export interface SelectOptionInterface {
  display: string
  value: any
}
