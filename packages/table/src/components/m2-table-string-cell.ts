import { TemplateResult, customElement, html, property } from 'lit-element'

import { AbstractM2TableCell } from '../abstracts/abstract-m2-table-cell'
import { StringColumnConfig } from '../interfaces/'
import { ValidityErrors } from '../enums'
import { ifDefined } from 'lit-html/directives/if-defined'

@customElement('m2-table-string-cell')
export class M2TableStringCell extends AbstractM2TableCell<HTMLInputElement> {
  editorAccessor: string = 'input'

  @property({ type: String }) value?: string

  renderEditor(config: StringColumnConfig): TemplateResult {
    return html`
      <input
        value="${ifDefined(this.value)}"
        placeholder="${ifDefined(config?.placeholder)}"
        ?required="${this.config.required}"
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

    return this.displayCellFactory(this.value)
  }

  focusOnEditor(): void {
    this.editor?.select()
  }

  checkValidity(value?: string): void {
    if (this.config.required && !value) throw new Error(ValidityErrors.VALUE_MISSING)
  }
}
