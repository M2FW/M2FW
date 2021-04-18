import { TemplateResult, customElement, html, property } from 'lit-element'

import { AbstractM2TableCell } from '../abstracts'
import { ImageColumnConfig } from '../interfaces'
import { ValidityErrors } from '../enums'

@customElement('m2-table-image-cell')
export class M2TableImageCell extends AbstractM2TableCell<HTMLInputElement> {
  @property({ type: String }) value?: string

  editorAccessor: string = 'input'

  renderEditor({ srcType = 'url' }: ImageColumnConfig): TemplateResult {
    const inputType: 'url' | 'text' = srcType === 'url' ? 'url' : 'text'

    return html`<input type="${inputType}" value="${this.value || ''}" ?required="${this.isRequired}" />`
  }

  renderDisplay(imageColumnConfig: ImageColumnConfig): TemplateResult {
    if (this.rowIdx !== undefined && this.rowIdx < 0) return this.displayCellFactory(this.config.header)
    return html`${this.buildImageTag(imageColumnConfig)}`
  }

  focusOnEditor(): void {
    this.editor?.select()
  }

  private buildImageTag({ styles, alt, defaultSrc, notFoundSrc }: ImageColumnConfig): HTMLImageElement {
    const imageElement: HTMLImageElement = new Image()
    let src: string = String(this.value)
    if (typeof this.config.displayValue === 'function') {
      src = this.config.displayValue(this.config, this.record || {}, this.value, this.changedRecord)
    }

    if (!src && defaultSrc) src = defaultSrc
    imageElement.src = src

    if (alt) imageElement.alt = alt || ''
    if (notFoundSrc) imageElement.onerror = () => (imageElement.src = notFoundSrc)

    const props: string[] = Object.keys(styles || {})
    if (props.length) {
      props.forEach((prop: any) => {
        if (styles?.[prop]) {
          imageElement.style[prop] = styles[prop]
        }
      })
    }

    return imageElement
  }

  checkValidity(value: string): void {
    if (this.isRequired && !value) throw new Error(ValidityErrors.VALUE_MISSING)
  }
}
