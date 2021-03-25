import { ColumnConfig, RowSelectorOption, TableButton } from '../interfaces'
import { LitElement, property } from 'lit-element'

export abstract class AbstractM2TablePart extends LitElement {
  @property({ type: Array }) columns: any[] = []
  @property({ type: Array }) buttons: TableButton[] = []
  @property({ type: Boolean }) numbering: boolean = true
  @property({ type: Object }) selectable: RowSelectorOption = {
    exclusive: false,
    fieldIdentifier: 'id',
    stackSelection: true,
    handySelector: true,
  }
  @property({ type: Boolean }) addable: boolean = true
  @property({ type: Boolean }) removable: boolean = true
}
