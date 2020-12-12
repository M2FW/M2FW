import { FloatColumnConfig, IntegerColumnConfig } from './NumberColumnConfig'

import { BaseColumnConfig } from './BaseColumnConfig'
import { BooleanColumnConfig } from './BooleanColumnConfig'
import { ObjectColumnConfig } from './ObjectColumnConfig'
import { SelectColumnConfig } from './SelectColumnConfig'
import { StringColumnConfig } from './StringColumnConfig'

export interface ColumnConfig
  extends BaseColumnConfig,
    BooleanColumnConfig,
    ObjectColumnConfig,
    IntegerColumnConfig,
    FloatColumnConfig,
    SelectColumnConfig,
    StringColumnConfig {}
