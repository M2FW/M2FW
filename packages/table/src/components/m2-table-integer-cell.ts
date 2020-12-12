import { TemplateResult, customElement, html, property } from 'lit-element'

import { AbstractM2TableCell } from '../abstracts/abstract-m2-table-cell'
import { Events } from '../enums'
import { IntegerColumnConfig } from '../interfaces'
import { ifDefined } from 'lit-html/directives/if-defined'

@customElement('m2-table-integer-cell')
export class M2TableIntegerCell extends AbstractM2TableCell<HTMLInputElement> {
  editorAccessor: string = 'input[type=number]'

  @property({ type: Number }) value?: number

  renderEditor(config: IntegerColumnConfig): TemplateResult {
    const { min, max }: IntegerColumnConfig = config

    return html`
      <input
        type="number"
        value="${ifDefined(this.value)}"
        min="${ifDefined(min)}"
        max="${ifDefined(max)}"
      />
    `
  }

  renderDisplay(config: IntegerColumnConfig): TemplateResult {
    let { displayValue }: IntegerColumnConfig = config

    if (displayValue && typeof displayValue === 'string') {
      return this.displayCellFactory(displayValue)
    } else if (displayValue && typeof displayValue === 'function') {
      return this.displayCellFactory(displayValue(this.value))
    }

    return this.displayCellFactory(this.value)
  }

  focusOnEditor(): void {
    this.editor?.select()
  }

  parseValue(value: any): number {
    return Number(value)
  }
}
