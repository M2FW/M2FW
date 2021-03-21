import { TemplateResult, customElement, html, property } from 'lit-element'

import { AbstractM2TableCell } from '../abstracts'
import { ImageColumnConfig } from '../interfaces'

@customElement('m2-table-image-cell')
export class M2TableImageCell extends AbstractM2TableCell<HTMLInputElement> {
  @property({ type: String }) value?: string

  editorAccessor: string = 'input'

  renderEditor({ srcType = 'url' }: ImageColumnConfig): TemplateResult {
    const inputType: 'url' | 'text' = srcType === 'url' ? 'url' : 'text'

    return html`<input type="${inputType}" value="${this.value || ''}" />`
  }

  renderDisplay(imageColumnConfig: ImageColumnConfig): TemplateResult {
    return html`${this.buildImageTag(imageColumnConfig)}`
  }

  focusOnEditor(): void {
    this.editor?.select()
  }

  private buildImageTag({ width, height, styles, alt, defaultSrc, notFoundSrc }: ImageColumnConfig): HTMLImageElement {
    const imageElement: HTMLImageElement = new Image(width, height)
    let src: string = String(this.value)

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

  checkValidity(): boolean {
    return this.editor?.checkValidity()
  }
}
