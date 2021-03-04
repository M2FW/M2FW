import { ColumnAlign, ColumnTypes } from '../enums'

import { TableData } from './TableData'

export interface BaseColumnConfig {
  name: string
  primary?: boolean
  header?: string | ((...args: any) => string)
  displayValue?: string | ((value: any) => string)
  type?: ColumnTypes
  width?: number
  validator?: RegExp | Function
  hidden?: boolean
  align?: ColumnAlign
  editable?: boolean | ((record?: TableData) => boolean)
}
