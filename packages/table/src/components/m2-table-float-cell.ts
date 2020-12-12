import { TemplateResult, customElement, html, property } from 'lit-element'

import { AbstractM2TableCell } from '../abstracts/abstract-m2-table-cell'
import { ColumnConfig } from '../interfaces'
import { ifDefined } from 'lit-html/directives/if-defined'

@customElement('m2-table-float-cell')
export class M2TableFloatCell extends AbstractM2TableCell<HTMLInputElement> {
  editorAccessor: string = 'input[type=number]'

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
        : html`${this.renderDisplay}`}
    `
  }

  renderEditor(config: ColumnConfig): TemplateResult {
    throw new Error('Method not implemented.')
  }
  renderDisplay(config: ColumnConfig): TemplateResult {
    throw new Error('Method not implemented.')
  }

  focusOnEditor(): void {
    this.editor?.select()
  }

  parseValue(value: any): number {
    return Number(value)
  }
}
