import { SelectColumnConfig, SelectOption } from '../interfaces'
import { TemplateResult, customElement, html, property } from 'lit-element'

import { AbstractM2TableCell } from '../abstracts/abstract-m2-table-cell'

@customElement('m2-table-object-cell')
export class M2TableObjectCell extends AbstractM2TableCell {
  @property({ type: Object }) config?: SelectColumnConfig

  render(): TemplateResult {
    if (!this.config?.options)
      throw new Error('Options should be defined for object column')

    return html`
      ${this._isEditing
        ? html`
            <select>
              <option></option>
              ${((this.config?.options as any) || []).map(
                (option: string | SelectOption): TemplateResult => {
                  if (typeof option === 'string') {
                    return html`<option ?selected="${option === this.value}">
                      ${option}
                    </option>`
                  } else {
                    option = option as SelectOption
                    return html`<option
                      value="${option.value}"
                      ?selected="${option.value === this.value}"
                    >
                      ${option.display}
                    </option>`
                  }
                }
              )}
            </select>
          `
        : html`${this.displayValue}`}
    `
  }

  get displayValue(): TemplateResult | void {
    if (this.config?.options?.length) {
      const selectedOption: string | SelectOption = (this.config
        .options as any).find((option: string | SelectOption) => {
        if (typeof option === 'string') {
          return option === this.value
        } else {
          return option.value === this.value
        }
      })

      if (selectedOption) {
        const displayValue: string =
          typeof selectedOption === 'string'
            ? selectedOption
            : selectedOption.display
        return html`<div>${displayValue}</div>`
      }
    }
  }

  get editor(): HTMLSelectElement | null {
    return this.renderRoot?.querySelector('select')
  }

  focusOnEditor(): void {
    this.editor?.focus()
  }
}
