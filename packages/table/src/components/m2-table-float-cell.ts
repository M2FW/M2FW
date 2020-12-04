import { TemplateResult, customElement, html, property } from 'lit-element'

import { AbstractM2TableCell } from '../abstracts/abstract-m2-table-cell'
import { Events } from '../enums'
import { FloatColumnConfig } from '../interfaces'
import { ifDefined } from 'lit-html/directives/if-defined'

@customElement('m2-table-float-cell')
export class M2TableFloatCell extends AbstractM2TableCell {
  @property({ type: Object }) config?: FloatColumnConfig
  @property({ type: Number }) value?: number

  render(): TemplateResult {
    return html`
      ${this._isEditing
        ? html`
            <input
              type="number"
              value="${ifDefined(this.value)}"
              min="${ifDefined(this.config?.min)}"
              max="${ifDefined(this.config?.max)}"
              step="${ifDefined(this.config?.step)}"
            />
          `
        : html`${this.displayValue}`}
    `
  }

  get editor(): HTMLInputElement | null {
    return this.renderRoot?.querySelector('input[type=number]')
  }

  focusOnEditor(): void {
    this.editor?.select()
  }

  setValue(): void {
    const oldValue: number = Number(this.value || 0)
    const newValue: number = Number(
      (this.editor as HTMLInputElement | HTMLSelectElement).value || 0
    )

    if (oldValue != newValue) {
      this.value = newValue
      this.dispatchEvent(
        new CustomEvent(Events.CellValueChange, {
          detail: { field: this.config?.name, oldValue, newValue },
          bubbles: true,
          composed: true,
          cancelable: true,
        })
      )
    }
  }
}
