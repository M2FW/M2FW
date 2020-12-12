import {
  CSSResult,
  LitElement,
  PropertyValues,
  TemplateResult,
  html,
  property,
} from 'lit-element'
import { KeyActions, keyMapper } from '../utils/key-mapper'

import { ColumnConfig } from '../interfaces'
import { cellStyle } from '../assets/styles'

export abstract class AbstractM2TableCell extends LitElement {
  @property({ type: Object }) config?: ColumnConfig
  @property({ type: String }) value?: any
  @property({ type: Boolean }) _isEditing: boolean = false
  @property({ type: Boolean }) _isFocused: boolean = false

  constructor() {
    super()
    this.contentEditable = 'true'

    this.addEventListener('focus', this.onfocusHandler.bind(this))
    this.addEventListener('blur', this.onblurHandler.bind(this))
    this.addEventListener('dblclick', this.ondblclickHandler.bind(this))
    this.addEventListener('keydown', this.onkeydownHandler.bind(this))
  }

  static get styles(): CSSResult[] {
    return [cellStyle]
  }

  get displayValue(): TemplateResult | void {
    if (this.config?.displayValue) {
      const displayValue: string | Function = this.config.displayValue

      if (displayValue instanceof String) {
        return html`<div>${displayValue}</div>`
      } else if (displayValue instanceof Function) {
        return html`<div>${displayValue(this.value)}</div>`
      }
    } else {
      return this.defaultDisplay
    }
  }

  get editor(): HTMLElement | null {
    throw new Error('Should be implemented')
  }

  get defaultDisplay(): TemplateResult {
    return html`<div>${this.value}</div>`
  }

  updated(changedProps: PropertyValues) {
    if (changedProps.has('_isEditing')) {
      this._dispatchModeChangeEvent()
    }
  }

  /**
   * @description focus event handler
   * @param _e nonused
   */
  onfocusHandler(): void {
    this._isFocused = true
    this._dispatchFocusChangeEvent()
  }

  /**
   * @description modeChange Event dispatcher
   * When value of this._isEditing is changed dispatch custom event
   */
  _dispatchModeChangeEvent(): void {
    this.dispatchEvent(
      new CustomEvent('modeChange', {
        detail: { _isEditing: this._isEditing },
        bubbles: true,
        composed: true,
        cancelable: true,
      })
    )
  }

  /**
   * @description focusChange Event dispatcher
   */
  _dispatchFocusChangeEvent(): void {
    this.dispatchEvent(
      new CustomEvent('focusChange', {
        detail: { _isFocused: this._isFocused },
        bubbles: true,
        composed: true,
        cancelable: true,
      })
    )
  }

  /**
   * @description blur event handler
   */
  onblurHandler(): void {
    if (this._isEditing) {
      this.setValue()
    }

    this._isEditing = false
  }

  /**
   * @description double click event handler
   */
  async ondblclickHandler(): Promise<void> {
    this._isEditing = true
    await this.updateComplete
    this.focusOnEditor()
  }

  /**
   * @description keydown event handler
   * @param event
   */
  onkeydownHandler(event: KeyboardEvent): void {
    if (keyMapper(event.code, KeyActions.TOGGLE_EDITING)) {
      this.toggleEditing()
    }
  }

  /**
   * @description toggle editing/displaying mode
   */
  async toggleEditing(): Promise<void> {
    if (this._isEditing) {
      this._isEditing = false
      this.setValue()
      this.focus()
    } else {
      this._isEditing = true
      await this.updateComplete
      this.focusOnEditor()
    }
  }

  /**
   * @description Should be implemented by specific cell component, Refer: m2-table-string-column
   */
  focusOnEditor(): void {
    throw new Error('Should be implemented')
  }

  /**
   * @description set value if value is changed and dispatch valueChange custom event.
   */
  setValue(): void {
    const oldValue: any = this.value
    const newValue: any = (this.editor as HTMLInputElement | HTMLSelectElement)
      .value

    if (oldValue != newValue) {
      this.value = newValue
      this.dispatchEvent(
        new CustomEvent('valueChange', {
          detail: { field: this.config?.name, oldValue, newValue },
          bubbles: true,
          composed: true,
          cancelable: true,
        })
      )
    }
  }
}
