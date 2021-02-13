import { BaseColumnConfig } from './BaseColumnConfig'

export interface DateColumnConfig extends BaseColumnConfig {
  max?: number
  min?: number
  step?: number
}
