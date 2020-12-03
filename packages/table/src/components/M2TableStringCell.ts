import { TemplateResult, customElement, html, property } from 'lit-element'

import { AbstractM2TableCell } from '../abstracts/AbstractM2TableCell'
import { StringColumnConfig } from '../interfaces/'
import { ifDefined } from 'lit-html/directives/if-defined'

@customElement('m2-table-string-cell')
export class M2TableStringCell extends AbstractM2TableCell {
  @property({ type: Object }) config?: StringColumnConfig
  @property({ type: String }) value?: string

  render(): TemplateResult {
    return html`
      ${this._isEditing
        ? html`
            <input
              value="${ifDefined(this.value)}"
              placeholder="${ifDefined(this.config?.placeholder)}"
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
