import { TemplateResult, customElement, html, property } from 'lit-element'

import { AbstractM2TableCell } from '../abstracts/abstract-m2-table-cell'
import { IntegerColumnConfig } from '../interfaces'
import { ValidityErrors } from '../enums'
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
        ?required="${this.isRequired}"
      />
    `
  }

  renderDisplay(config: IntegerColumnConfig): TemplateResult {
    let { displayValue }: IntegerColumnConfig = config

    if (displayValue && typeof displayValue === 'string') {
      return this.displayCellFactory(displayValue)
    } else if (displayValue && typeof displayValue === 'function') {
      return this.displayCellFactory(displayValue(this.config, this.record || {}, this.value, this.changedRecord))
    }

    return this.displayCellFactory(this.value)
  }

  focusOnEditor(): void {
    this.editor?.select()
  }

  parseValue(value: any): number {
    return Number(value)
  }

  checkValidity(): void {
    const { required, min, max }: IntegerColumnConfig = this.config
    if (required && (this.value === null || this.value === undefined || isNaN(this.value)))
      throw new Error(ValidityErrors.VALUE_MISSING)

    if (this.value) {
      if (min !== undefined && min > this.value) throw new Error(ValidityErrors.RANGE_UNDERFLOW)
      if (max !== undefined && max < this.value) throw new Error(ValidityErrors.RANGE_OVERFLOW)
    }
  }
}
