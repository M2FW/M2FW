import { LitElement, property } from 'lit-element'
import { ColumnConfigInterface, TableButtonInterface } from '../interfaces'

export abstract class AbstractM2TablePart extends LitElement {
  @property({ type: Array }) columns: ColumnConfigInterface[] = []
  @property({ type: Array }) buttons: TableButtonInterface[] = []
  @property({ type: Boolean }) numbering: boolean = true
  @property({ type: Boolean }) selectable: boolean = false
  @property({ type: Boolean }) appendable: boolean = true
  @property({ type: Boolean }) deletable: boolean = true
}
