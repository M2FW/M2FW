import { DateColumnConfig, StringColumnConfig } from '../interfaces'
import { TemplateResult, customElement, html, property } from 'lit-element'

import { AbstractM2TableCell } from '../abstracts/abstract-m2-table-cell'
import { ValidityErrors } from '../enums'
import { ifDefined } from 'lit-html/directives/if-defined'

@customElement('m2-table-date-cell')
export class M2TableDateCell extends AbstractM2TableCell<HTMLInputElement> {
  editorAccessor: string = 'input'

  @property({ type: Number }) value?: number

  renderEditor(config: DateColumnConfig): TemplateResult {
    const { max, min, step }: DateColumnConfig = config

    let dateStr: string | undefined = undefined
    if (this.value) {
      const date: Date = new Date(this.value)
      dateStr = this.convertDateToString(date)
    }

    return html`
      <input
        value="${ifDefined(dateStr)}"
        max="${ifDefined(max)}"
        min="${ifDefined(min)}"
        step="${ifDefined(step)}"
        ?required="${this.config.required}"
        type="date"
      />
    `
  }

  renderDisplay(config: StringColumnConfig): TemplateResult {
    const { displayValue }: StringColumnConfig = config

    if (displayValue && typeof displayValue === 'string') {
      return this.displayCellFactory(displayValue)
    } else if (displayValue && typeof displayValue === 'function') {
      return this.displayCellFactory(displayValue(this.value))
    }

    if (this.value) {
      const date: Date = new Date(this.value)

      return this.displayCellFactory(date.toDateString())
    } else {
      return this.displayCellFactory('')
    }
  }

  parseValue(value: any) {
    if (typeof value === 'string') {
      return new Date(value).getTime()
    } else {
      return value
    }
  }

  focusOnEditor(): void {
    this.editor?.select()
  }

  convertDateToString(standardDate: Date): string {
    const year: string = String(standardDate.getFullYear())
    const month: string = String(standardDate.getMonth() + 1).padStart(2, '0')
    const date: string = String(standardDate.getDate()).padStart(2, '0')

    return `${year}-${month}-${date}`
  }

  checkValidity(): void {
    const { required, min, max }: DateColumnConfig = this.config
    if (required && (this.value === null || this.value === undefined || isNaN(this.value)))
      throw new Error(ValidityErrors.VALUE_MISSING)

    if (this.value) {
      if (min !== undefined && min > this.value) throw new Error(ValidityErrors.RANGE_UNDERFLOW)
      if (max !== undefined && max < this.value) throw new Error(ValidityErrors.RANGE_OVERFLOW)
    }
  }
}
