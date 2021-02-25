import { FloatColumnConfig, IntegerColumnConfig } from './NumberColumnConfig'

import { BooleanColumnConfig } from './BooleanColumnConfig'
import { DateColumnConfig } from './DateColumnConfig'
import { DateTimeColumnConfig } from './DateTimeColumnConfig'
import { ImageColumnConfig } from './ImageColumnConfig'
import { ObjectColumnConfig } from './ObjectColumnConfig'
import { SelectColumnConfig } from './SelectColumnConfig'
import { StringColumnConfig } from './StringColumnConfig'

export declare type ColumnConfig =
  | BooleanColumnConfig
  | DateColumnConfig
  | DateTimeColumnConfig
  | FloatColumnConfig
  | ImageColumnConfig
  | IntegerColumnConfig
  | ObjectColumnConfig
  | SelectColumnConfig
  | StringColumnConfig
