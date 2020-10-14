import { customElement, html, property, TemplateResult } from 'lit-element'
import { AbstractM2TableCell } from '../abstracts/AbstractM2TableCell'
import { Events } from '../enums'
import { BooleanColumnConfigInterface } from '../interfaces'

@customElement('m2-table-boolean-cell')
export class M2TableBooleanCell extends AbstractM2TableCell {
  @property({ type: Object }) config?: BooleanColumnConfigInterface
  @property({ type: Boolean }) value?: boolean

  render(): TemplateResult {
    return html`
      ${this._isEditing
        ? html`<input type="checkbox" .checked="${this.value || false}" /> `
        : html`${this.displayValue}`}
    `
  }

  get defaultDisplay(): TemplateResult {
    return html`<div>
      <input type="checkbox" disabled ?checked="${this.value || false}" />
    </div>`
  }

  get editor(): HTMLInputElement | null {
    return this.renderRoot?.querySelector('input[type=checkbox]')
  }

  focusOnEditor(): void {
    this.editor?.select()
  }

  setValue(): void {
    const oldValue: boolean = Boolean(this.value)
    const newValue: boolean = (this.editor as HTMLInputElement).checked

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
