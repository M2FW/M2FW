import { BaseColumnConfig } from './BaseColumnConfig'

export interface IntegerColumnConfig extends BaseColumnConfig {
  min?: number
  max?: number
}

export interface FloatColumnConfig extends IntegerColumnConfig {
  step?: number
}
