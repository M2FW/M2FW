import { DateTimeColumnConfig, StringColumnConfig } from '../interfaces/'
import { TemplateResult, customElement, html, property } from 'lit-element'

import { AbstractM2TableCell } from '../abstracts/abstract-m2-table-cell'
import { ValidityErrors } from '../enums'
import { ifDefined } from 'lit-html/directives/if-defined'

@customElement('m2-table-datetime-cell')
export class M2TableDateTimeCell extends AbstractM2TableCell<HTMLInputElement> {
  editorAccessor: string = 'input'

  @property({ type: Number }) value?: number

  renderEditor(config: DateTimeColumnConfig): TemplateResult {
    const { max, min, step }: DateTimeColumnConfig = config

    let dateStr: string | undefined = undefined
    if (this.value) {
      const date: Date = this.adjustTimezoneOffset(this.value)
      dateStr = this.convertDateToString(date)
    }

    return html`
      <input
        value="${ifDefined(dateStr)}"
        max="${ifDefined(max)}"
        min="${ifDefined(min)}"
        step="${ifDefined(step)}"
        ?required="${this.isRequired}"
        type="datetime-local"
      />
    `
  }

  renderDisplay(config: StringColumnConfig): TemplateResult {
    const { displayValue }: StringColumnConfig = config

    if (displayValue && typeof displayValue === 'string') {
      return this.displayCellFactory(displayValue)
    } else if (displayValue && typeof displayValue === 'function') {
      return this.displayCellFactory(displayValue(this.config, this.record || {}, this.value, this.changedRecord))
    }

    if (this.value) {
      const date: Date = this.adjustTimezoneOffset(this.value)

      return this.displayCellFactory(date.toLocaleString())
    } else {
      return this.displayCellFactory('')
    }
  }

  parseValue(value: any) {
    if (typeof value === 'string') {
      const timezoneOffset: number = new Date().getTimezoneOffset() * 60000
      const date: Date = new Date(value)
      date.setTime(date.getTime() + timezoneOffset)

      return date.getTime()
    } else {
      return value
    }
  }

  focusOnEditor(): void {
    this.editor?.select()
  }

  adjustTimezoneOffset(value: number) {
    const timezoneOffset: number = new Date().getTimezoneOffset() * 60000
    const date: Date = new Date(value)
    date.setTime(date.getTime() - timezoneOffset)

    return date
  }

  convertDateToString(standardDate: Date): string {
    const year: string = String(standardDate.getFullYear())
    const month: string = String(standardDate.getMonth() + 1).padStart(2, '0')
    const date: string = String(standardDate.getDate()).padStart(2, '0')

    const hours: string = String(standardDate.getHours()).padStart(2, '0')
    const minutes: string = String(standardDate.getMinutes()).padStart(2, '0')
    const seconds: string = String(standardDate.getSeconds()).padStart(2, '0')

    return `${year}-${month}-${date}T${hours}:${minutes}:${seconds}`
  }

  checkValidity(): void {
    const { required, min, max }: DateTimeColumnConfig = this.config
    if (required && (this.value === null || this.value === undefined || isNaN(this.value)))
      throw new Error(ValidityErrors.VALUE_MISSING)

    if (this.value) {
      if (min !== undefined && min > this.value) throw new Error(ValidityErrors.RANGE_UNDERFLOW)
      if (max !== undefined && max < this.value) throw new Error(ValidityErrors.RANGE_OVERFLOW)
    }
  }
}
