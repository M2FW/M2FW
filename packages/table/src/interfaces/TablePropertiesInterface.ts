export interface TablePropertiesInterface {
  selected?: boolean
  changed?: boolean
  changedValues?: TableChangeValuePropertiesInterface[]
  appended?: boolean
  deleted?: boolean
}

export interface TableChangeValuePropertiesInterface {
  field: string
  origin: any
  changes: any
}
