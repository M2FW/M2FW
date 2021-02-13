import { FloatColumnConfig, IntegerColumnConfig } from './NumberColumnConfig'

import { BooleanColumnConfig } from './BooleanColumnConfig'
import { DateColumnConfig } from './DateColumnConfig'
import { DateTimeColumnConfig } from './DateTimeColumnConfig'
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
  | DateTimeColumnConfig
  | DateColumnConfig
