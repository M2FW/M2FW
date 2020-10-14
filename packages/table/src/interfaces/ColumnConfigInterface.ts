import { BaseColumnConfigInterface } from './BaseColumnConfigInterface'
import { BooleanColumnConfigInterface } from './BooleanColumnConfigInterface'
import {
  FloatColumnConfigInterface,
  NumberColumnConfigInterface,
} from './NumberColumnConfigInterface'
import { SelectColumnConfigInterface } from './SelectColumnConfigInterface'
import { StringColumnConfigInterface } from './StringColumnConfigInterface'

export interface ColumnConfigInterface
  extends BaseColumnConfigInterface,
    BooleanColumnConfigInterface,
    NumberColumnConfigInterface,
    FloatColumnConfigInterface,
    SelectColumnConfigInterface,
    StringColumnConfigInterface {}
