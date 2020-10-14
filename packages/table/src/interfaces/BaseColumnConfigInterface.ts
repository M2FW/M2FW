import { ColumnAlign, ColumnTypes } from '../enums'

export interface BaseColumnConfigInterface {
  name: string
  primary?: boolean
  header?: string | Function
  displayValue?: string | Function
  type?: ColumnTypes
  width?: number
  validator?: RegExp | Function
  hidden?: boolean
  align?: ColumnAlign
}
