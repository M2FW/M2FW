import { ColumnConfig, FloatColumnConfig } from '../interfaces'
import { TemplateResult, customElement, html, property } from 'lit-element'

import { AbstractM2TableCell } from '../abstracts/abstract-m2-table-cell'
import { ifDefined } from 'lit-html/directives/if-defined'

@customElement('m2-table-float-cell')
export class M2TableFloatCell extends AbstractM2TableCell<HTMLInputElement> {
  editorAccessor: string = 'input[type=number]'

  @property({ type: Number }) value?: number

  renderEditor(config: FloatColumnConfig): TemplateResult {
    const { min, max, step = 0.01 }: FloatColumnConfig = config

    return html`
      ${this._isEditing
        ? html`
            <input
              type="number"
              type="number"
              value="${ifDefined(this.value)}"
              min="${ifDefined(min)}"
              max="${ifDefined(max)}"
              step="${ifDefined(step)}"
            />
          `
        : html`${this.renderDisplay}`}
    `
  }

  renderDisplay(config: ColumnConfig): TemplateResult {
    let { displayValue, step = 0.01 }: FloatColumnConfig = config

    if (displayValue && typeof displayValue === 'string') {
      return this.displayCellFactory(displayValue)
    } else if (displayValue && typeof displayValue === 'function') {
      return this.displayCellFactory(displayValue(this.config, this.record || {}, this.value, this.changedRecord))
    }

    const valueStr: string = this.value?.toString() || ''
    const stepStr: string = step.toString() || ''
    const parsedValue: string = valueStr?.substr(0, valueStr.split('.')[0].length + 1 + stepStr.split('.')[1].length)
    this.value = Number(parsedValue)

    return this.displayCellFactory(this.value)
  }

  focusOnEditor(): void {
    this.editor?.select()
  }

  parseValue(value: any): number {
    return Number(value)
  }

  checkValidity(): boolean {
    return this.editor?.checkValidity()
  }
}
