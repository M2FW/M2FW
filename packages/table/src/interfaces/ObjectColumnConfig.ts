import { BaseColumnConfig } from './BaseColumnConfig'
import { TableData } from './TableData'

export interface ObjectColumnConfig extends BaseColumnConfig {
  displayField?: string
  renderEditor?: (
    config: ObjectColumnConfig,
    record: TableData,
    value: any,
    setValueHandler: (value: Record<string, any>) => void
  ) => any
}
