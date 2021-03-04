import { TemplateResult, customElement, html } from 'lit-element'

import { AbstractM2TableCell } from '../abstracts/abstract-m2-table-cell'
import { ObjectColumnConfig } from '../interfaces'

@customElement('m2-table-object-cell')
export class M2TableObjectCell extends AbstractM2TableCell<HTMLInputElement> {
  editorAccessor: string = ''

  renderEditor(config: ObjectColumnConfig): TemplateResult {
    const { editable, renderEditor }: ObjectColumnConfig = config

    if (!editable) return this.renderDisplay(config)

    if (!renderEditor) {
      throw new Error('renderEditor is not implemented.')
    }

    return renderEditor(config, this.value, (newValue: any) => {
      this._isEditing = false

      const oldValue = this.value
      if (oldValue != newValue) {
        this.value = newValue
        this.dispatchValueChangeEvent(oldValue, newValue)
      }
    })
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
