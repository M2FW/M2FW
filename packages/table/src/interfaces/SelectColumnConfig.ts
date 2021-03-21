import { BaseColumnConfig } from './BaseColumnConfig'

export interface SelectColumnConfig extends BaseColumnConfig {
  includeEmpty?: boolean
  options?: string[] | SelectOption[]
}

export interface SelectOption {
  display: string
  value: any
}
