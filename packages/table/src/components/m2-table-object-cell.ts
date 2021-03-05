import { TemplateResult, customElement, html } from 'lit-element'

import { AbstractM2TableCell } from '../abstracts/abstract-m2-table-cell'
import { ObjectColumnConfig } from '../interfaces'

@customElement('m2-table-object-cell')
export class M2TableObjectCell extends AbstractM2TableCell<HTMLInputElement> {
  editorAccessor: string = ''

  renderEditor(config: ObjectColumnConfig): TemplateResult {
    const { renderEditor }: ObjectColumnConfig = config

    if (!renderEditor) {
      throw new Error('renderEditor is not implemented.')
    }

    const result: TemplateResult | null | undefined = renderEditor(
      config,
      this.value,
      (newValue: any) => {
        this._isEditing = false

        const oldValue = this.value
        if (oldValue != newValue) {
          this.value = newValue
          this.dispatchValueChangeEvent(oldValue, newValue)
        }
      },
      html
    )

    if (result) return result
    return this.renderDisplay(config)
  }

  renderDisplay(config: ObjectColumnConfig): TemplateResult {
    let { displayField, displayValue }: ObjectColumnConfig = config

    if (displayValue && typeof displayValue === 'string') {
      return this.displayCellFactory(displayValue)
    } else if (displayValue && typeof displayValue === 'function') {
      return this.displayCellFactory(displayValue(this.value))
    }

    if (!displayField) {
      const keys: string[] = Object.keys(this.value)

      if (keys.find((key: string) => key === 'name')) {
        displayField = 'name'
      } else {
        displayField = keys[0]
      }
    }

    return this.displayCellFactory(this.value[displayField])
  }

  focusOnEditor(): void {
    return
  }

  onblurHandler() {
    return
  }
}
