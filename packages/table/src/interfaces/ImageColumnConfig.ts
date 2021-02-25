import { BaseColumnConfig } from './BaseColumnConfig'

export interface ImageColumnConfig extends BaseColumnConfig {
  srcType?: 'url' | 'base64'
  width?: number
  height?: number
  styles?: Record<string, any>
  alt?: string
  defaultSrc?: string
  notFoundSrc?: string
}
