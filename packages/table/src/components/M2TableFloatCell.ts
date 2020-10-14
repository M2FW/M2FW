import { customElement, html, property, TemplateResult } from 'lit-element'
import { AbstractM2TableCell } from '../abstracts/AbstractM2TableCell'
import { Events } from '../enums'
import { FloatColumnConfigInterface } from '../interfaces'

@customElement('m2-table-float-cell')
export class M2TableFloatCell extends AbstractM2TableCell {
  @property({ type: Object }) config?: FloatColumnConfigInterface
  @property({ type: Number }) value?: number

  render(): TemplateResult {
    return html`
      ${this._isEditing
        ? html`
            <input
              type="number"
              value="${this.value}"
              min="${this.config?.min}"
              max="${this.config?.max}"
              step="${this.config?.step}"
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
