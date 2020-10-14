import { customElement, html, property, TemplateResult } from 'lit-element'
import { AbstractM2TableCell } from '../abstracts/AbstractM2TableCell'
import { Events } from '../enums'
import { NumberColumnConfigInterface } from '../interfaces'

@customElement('m2-table-integer-cell')
export class M2TableIntegerCell extends AbstractM2TableCell {
  @property({ type: Object }) config?: NumberColumnConfigInterface
  @property({ type: Number }) value?: number

  render(): TemplateResult {
    return html`
      ${this._isEditing
        ? html`
            <input
              type="number"
              value="${this.value}"
              min="${this.config?.min && this.config.min !== undefined}"
              max="${this.config?.max && this.config.max !== undefined}"
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
