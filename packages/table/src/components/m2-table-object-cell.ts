import { TemplateResult, customElement, html } from 'lit-element'

import { AbstractM2TableCell } from '../abstracts/abstract-m2-table-cell'
import { ObjectColumnConfig } from '../interfaces'
import { ValidityErrors } from '../enums'

@customElement('m2-table-object-cell')
export class M2TableObjectCell extends AbstractM2TableCell<HTMLInputElement> {
  private selectedRecord: Record<string, any> = {}
  
  editorAccessor: string = '#object-input'
  valueAccessKey: string = 'data-object'

  renderEditor(config: ObjectColumnConfig): TemplateResult {
    const { renderEditor }: ObjectColumnConfig = config

    if (!renderEditor) {
      throw new Error('renderEditor is not implemented.')
    }

    const result: TemplateResult | void = renderEditor(
      config,
      this.record || {},
      this.value,
      async (value: Record<string, any>): Promise<void> => {
        this.selectedRecord = value
        this.toggleEditing()
      }
    )

    if (result) return result
    return html`<input id="object-input" hidden .data-object="${this.selectedRecord}" />`
  }

  renderDisplay(config: ObjectColumnConfig): TemplateResult {
    let { displayField, displayValue }: ObjectColumnConfig = config

    if (displayValue && typeof displayValue === 'string') {
      return this.displayCellFactory(displayValue)
    } else if (displayValue && typeof displayValue === 'function') {
      return this.displayCellFactory(displayValue(this.config, this.record || {}, this.value, this.changedRecord))
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

  checkValidity(value: any): void {
    if (this.isRequired && (!value || !Object.keys(value).length)) throw new Error(ValidityErrors.VALUE_MISSING)
  }

  getEditorValue(): Record<string, any> {
    return this.selectedRecord
  }
}
