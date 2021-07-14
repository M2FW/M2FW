import { ColumnAlign, ColumnTypes } from '../enums'

import { ColumnConfig } from './ColumnConfig'
import { TableData } from './TableData'

export interface BaseColumnConfig {
  name: string
  primary?: boolean
  header?: string | ((...args: any) => string)
  displayValue?: string | ((config: ColumnConfig, record: TableData, value: any, changedRecord: TableData) => any)
  defaultValue?: any | ((config: ColumnConfig, record: TableData, value: any, changedRecord: TableData) => any)
  type?: ColumnTypes
  width?: number
  validator?: RegExp | ((config: ColumnConfig, record: TableData, value: any, changedRecord: TableData) => void)
  hidden?: boolean
  align?: ColumnAlign
  editable?: boolean | ((config: ColumnConfig, record: TableData, value: any, changedRecord: TableData) => boolean)
  required?: boolean | ((config: ColumnConfig, record: TableData, value: any, changedRecord: TableData) => boolean)
  batchEditable?: boolean | ((config: ColumnConfig) => boolean)
  tooltip?: string
  selectable?: boolean
  sortable?: boolean
}
