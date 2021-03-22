import { BaseColumnConfig } from './BaseColumnConfig'

export interface ImageColumnConfig extends BaseColumnConfig {
  srcType?: 'url' | 'base64'
  styles?: Record<string, any>
  alt?: string
  defaultSrc?: string
  notFoundSrc?: string
}
