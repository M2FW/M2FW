import { BaseColumnConfig } from './BaseColumnConfig'

export interface DateTimeColumnConfig extends BaseColumnConfig {
  max?: number
  min?: number
  step?: number
}
