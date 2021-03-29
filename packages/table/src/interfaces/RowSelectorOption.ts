import { TableData } from './TableData'

export interface RowSelectorOption {
  exclusive: boolean
  stackSelection?: boolean
  fieldIdentifier: string | ((record: TableData) => any)
  handySelector?: boolean
  oneClickSelect?: boolean
}
