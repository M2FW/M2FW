import { customElement, html, property, TemplateResult } from 'lit-element'
import { AbstractM2TableCell } from '../abstracts/AbstractM2TableCell'
import { StringColumnConfigInterface } from '../interfaces/'

@customElement('m2-table-string-cell')
export class M2TableStringCell extends AbstractM2TableCell {
  @property({ type: Object }) config?: StringColumnConfigInterface
  @property({ type: String }) value?: string

  render(): TemplateResult {
    return html`
      ${this._isEditing
        ? html`
            <input
              value="${this.value}"
              placeholder="${this.config?.placeholder || ''}"
            />
          `
        : html`${this.displayValue}`}
    `
  }

  get editor(): HTMLInputElement | null {
    return this.renderRoot?.querySelector('input')
  }

  focusOnEditor(): void {
    this.editor?.select()
  }
}
