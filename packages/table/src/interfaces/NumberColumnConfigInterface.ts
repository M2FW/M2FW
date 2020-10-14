import { BaseColumnConfigInterface } from './BaseColumnConfigInterface'

export interface NumberColumnConfigInterface extends BaseColumnConfigInterface {
  min?: number
  max?: number
}

export interface FloatColumnConfigInterface
  extends NumberColumnConfigInterface {
  step?: number
}
