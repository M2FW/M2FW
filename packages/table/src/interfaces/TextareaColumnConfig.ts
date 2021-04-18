import { BaseColumnConfig } from './BaseColumnConfig'

export interface TextareaColumnConfig extends BaseColumnConfig {
  placeholder?: string
  maxlength?: number
  minlength?: number
}
