import { TemplateResult, customElement, html, property } from 'lit-element'

import { AbstractM2TableCell } from '../abstracts/abstract-m2-table-cell'
import { TextareaColumnConfig } from '../interfaces'
import { ValidityErrors } from '../enums'
import { ifDefined } from 'lit-html/directives/if-defined'

@customElement('m2-table-textarea-cell')
export class M2TableTextareaCell extends AbstractM2TableCell<HTMLTextAreaElement> {
  editorAccessor: string = 'textarea'

  @property({ type: String }) value?: string
  @property({ type: Number }) currentLength: number = 0

  renderEditor(config: TextareaColumnConfig): TemplateResult {
    return html`
      <div class="textarea-container">
        <textarea
          placeholder="${config?.placeholder || ''}"
          ?required="${this.isRequired}"
          maxlength="${ifDefined(config.maxlength)}"
          minlength="${ifDefined(config.minlength)}"
          @input="${this.onTextareaChangeHandler.bind(this)}"
          @keyup="${this.onTextareaChangeHandler.bind(this)}"
        >
${this.value}</textarea
        >

        ${config.maxlength && config.maxlength > 0
          ? html` <span id="length-indicator">${this.currentLength} / ${config.maxlength}</span> `
          : ''}
      </div>
    `
  }

  private onTextareaChangeHandler(event: KeyboardEvent): void {
    if (!this.config.maxlength) return

    const textarea: HTMLTextAreaElement = event.currentTarget as HTMLTextAreaElement
    const value: string = textarea.value
    if (value.length >= this.config.maxlength) value.substr(-1, 1)
    this.currentLength = value.length
  }

  renderDisplay(config: TextareaColumnConfig): TemplateResult {
    const { displayValue }: TextareaColumnConfig = config

    if (displayValue && typeof displayValue === 'string') {
      return this.displayCellFactory(displayValue)
    } else if (displayValue && typeof displayValue === 'function') {
      return this.displayCellFactory(displayValue(this.config, this.record || {}, this.value, this.changedRecord))
    }

    return this.displayCellFactory(this.value)
  }

  displayCellFactory(innerText: string | number | TemplateResult | undefined): TemplateResult {
    if (innerText === undefined) {
      innerText = ''
    }

    return html` <div class="dsp-cell textarea">${innerText}</div> `
  }

  focusOnEditor(): void {
    this.editor?.select()
  }

  checkValidity(value?: string): void {
    if (this.isRequired && !value) throw new Error(ValidityErrors.VALUE_MISSING)
  }
}
