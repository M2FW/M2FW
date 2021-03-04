import { BaseColumnConfig } from './BaseColumnConfig'
import { TableData } from './TableData'
import { TemplateResult } from 'lit-html'

export interface ObjectColumnConfig extends BaseColumnConfig {
  displayField?: string
  renderEditor?: (config: ObjectColumnConfig, value: TableData, setValueHandler: (value: any) => void) => TemplateResult
}
