import { BaseColumnConfig } from './BaseColumnConfig'

export interface SelectColumnConfig extends BaseColumnConfig {
  options?: string[] | SelectOption[]
}

export interface SelectOption {
  display: string
  value: any
}
