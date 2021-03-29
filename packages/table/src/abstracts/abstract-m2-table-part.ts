import { LitElement, property } from 'lit-element'
import { RowSelectorOption, TableButton } from '../interfaces'

export abstract class AbstractM2TablePart extends LitElement {
  @property({ type: Array }) columns: any[] = []
  @property({ type: Array }) buttons: TableButton[] = []
  @property({ type: Boolean }) numbering: boolean = true
  @property({ type: Object }) selectable: RowSelectorOption = {
    exclusive: false,
    fieldIdentifier: 'id',
    stackSelection: true,
    handySelector: true,
    oneClickSelect: false,
  }
  @property({ type: Boolean }) addable: boolean = true
  @property({ type: Boolean }) removable: boolean = true
  @property({ type: Number }) minColumnWidth: number = 60
  @property({ type: Number }) maxColumnWidth: number = Infinity
}
