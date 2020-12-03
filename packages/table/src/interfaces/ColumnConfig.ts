import { FloatColumnConfig, NumberColumnConfig } from './NumberColumnConfig'

import { BaseColumnConfig } from './BaseColumnConfig'
import { BooleanColumnConfig } from './BooleanColumnConfig'
import { SelectColumnConfig } from './SelectColumnConfig'
import { StringColumnConfig } from './StringColumnConfig'

export interface ColumnConfig
  extends BaseColumnConfig,
    BooleanColumnConfig,
    NumberColumnConfig,
    FloatColumnConfig,
    SelectColumnConfig,
    StringColumnConfig {}
