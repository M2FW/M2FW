import { FloatColumnConfig, IntegerColumnConfig } from './NumberColumnConfig'

import { BooleanColumnConfig } from './BooleanColumnConfig'
import { ObjectColumnConfig } from './ObjectColumnConfig'
import { SelectColumnConfig } from './SelectColumnConfig'
import { StringColumnConfig } from './StringColumnConfig'

export declare type ColumnConfig =
  | BooleanColumnConfig
  | ObjectColumnConfig
  | IntegerColumnConfig
  | FloatColumnConfig
  | SelectColumnConfig
  | StringColumnConfig
