import { BaseColumnConfig } from './BaseColumnConfig'

export interface NumberColumnConfig extends BaseColumnConfig {
  min?: number
  max?: number
}

export interface FloatColumnConfig extends NumberColumnConfig {
  step?: number
}
