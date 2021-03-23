import { ColumnAlign, ColumnTypes } from '../enums'

import { ColumnConfig } from './ColumnConfig'
import { TableData } from './TableData'

export interface BaseColumnConfig {
  name: string
  primary?: boolean
  header?: string | ((...args: any) => string)
  displayValue?: string | ((value: any) => string)
  type?: ColumnTypes
  width?: number
  validator?: RegExp | ((config: ColumnConfig, record: TableData, value: any, changedRecord: TableData) => void)
  hidden?: boolean
  align?: ColumnAlign
  editable?: boolean | ((config: ColumnConfig, record: TableData, value: any, changedRecord: TableData) => boolean)
  required?: boolean
}
