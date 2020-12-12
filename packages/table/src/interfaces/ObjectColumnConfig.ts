import { BaseColumnConfig } from './BaseColumnConfig'

export interface ObjectColumnConfig extends BaseColumnConfig {
  displayField?: string
  renderEditor?: (
    config: ObjectColumnConfig,
    value: any,
    setValueHandler: (value: any) => void
  ) => void
}
