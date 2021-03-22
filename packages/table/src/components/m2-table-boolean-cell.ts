import { BooleanColumnConfig, ColumnConfig } from '../interfaces'
import { TemplateResult, customElement, html, property } from 'lit-element'

import { AbstractM2TableCell } from '../abstracts/abstract-m2-table-cell'

@customElement('m2-table-boolean-cell')
export class M2TableBooleanCell extends AbstractM2TableCell<HTMLInputElement> {
  @property({ type: Boolean }) value?: boolean

  editorAccessor: string = 'input[type=checkbox]'

  renderEditor(_config: BooleanColumnConfig): TemplateResult {
    return html` <input type="checkbox" .checked="${this.value || false}" /> `
  }

  renderDisplay(_config: ColumnConfig): TemplateResult {
    return this.displayCellFactory(html` <input type="checkbox" disabled ?checked="${this.value || false}" /> `)
  }

  focusOnEditor(): void {
    this.editor?.select()
  }

  parseValue(value: any): boolean {
    return Boolean(value)
  }

  checkValidity(): boolean {
    return this.editor?.checkValidity()
  }
}
