export interface TableProperties {
  selected?: boolean
  changed?: boolean
  changedValues?: TableChangeValueProperties[]
  appended?: boolean
  deleted?: boolean
}

export interface TableChangeValueProperties {
  field: string
  origin: any
  changes: any
}
