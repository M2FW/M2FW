import { BaseColumnConfig } from './BaseColumnConfig'
import { TemplateResult } from 'lit-html'

export interface ObjectColumnConfig extends BaseColumnConfig {
  displayField?: string
  renderEditor?: (config: ObjectColumnConfig, value: any, setValueHandler: (value: any) => void) => TemplateResult
}
