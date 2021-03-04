import { CSSResult, LitElement, PropertyValues, TemplateResult, html, property } from 'lit-element'
import { CellEvents, ColumnTypes } from '../enums'
import { ColumnConfig, TableData } from '../interfaces'
import { KeyActions, keyMapper } from '../utils/key-mapper'

import { cellStyle } from '../assets/styles'

export abstract class AbstractM2TableCell<T> extends LitElement {
  @property({ type: Object }) config: ColumnConfig
  @property({ type: Object }) record?: TableData
  @property({ type: String }) value?: any
  @property({ type: Boolean }) _isEditing: boolean = false
  @property({ type: Boolean }) _isFocused: boolean = false

  constructor(config: ColumnConfig) {
    super()
    this.config = config

    this.contentEditable = 'true'

    this.addEventListener('focus', this.onfocusHandler.bind(this))
    this.addEventListener('blur', this.onblurHandler.bind(this))
    this.addEventListener('dblclick', this.ondblclickHandler.bind(this))
    this.addEventListener('keydown', this.onkeydownHandler.bind(this))
  }

  static get styles(): CSSResult[] {
    return [cellStyle]
  }

  abstract editorAccessor: string
  abstract renderEditor(config: ColumnConfig): TemplateResult
  abstract renderDisplay(config: ColumnConfig): TemplateResult
  abstract focusOnEditor(): void

  get editor(): T {
    const editor: T | null = this.renderRoot?.querySelector(this.editorAccessor) as any
    if (!editor) {
      throw new Error(`Failed to find editor by (${this.editorAccessor})`)
    }

    return editor
  }

  render(): TemplateResult {
    if (!this.config) return html``
    return html`
      ${this._isEditing && this.config.editable ? this.renderEditor(this.config) : this.renderDisplay(this.config)}
    `
  }

  updated(changedProps: PropertyValues) {
    if (changedProps.has('_isEditing')) {
      this._dispatchModeChangeEvent()
    }
  }

  /**
   * @description focus event handler
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
      new CustomEvent(CellEvents.ModeChange, {
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
      new CustomEvent(CellEvents.FocusChange, {
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
    let editable: boolean = true

    if (this.config?.editable) {
      if (typeof this.config.editable === 'function') {
        editable = this.config.editable(this.record || {}, this.config)
      } else {
        editable = Boolean(this.config?.editable)
      }
    }

    if (!editable) return

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
      const editable: boolean = Boolean(this.config?.editable)
      if (!editable) return
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
   * @description set value if value is changed and dispatch valueChange custom event.
   */
  private setValue(): void {
    const valueAccessKey: string = this.config.type === ColumnTypes.Boolean ? 'checked' : 'value'

    const oldValue: any = this.parseValue(this.value)
    const newValue: any = this.parseValue((this.editor as any)[valueAccessKey])

    if (oldValue != newValue) {
      this.value = newValue
      this.dispatchValueChangeEvent(oldValue, newValue)
    }
  }

  parseValue(value: any): any {
    return value
  }

  displayCellFactory(innerText: string | number | TemplateResult | undefined): TemplateResult {
    if (innerText === undefined) {
      innerText = ''
    }

    return html`
      <div class="dsp-cell">
        <span>${innerText}</span>
      </div>
    `
  }

  dispatchValueChangeEvent(oldValue: any, newValue: any): void {
    this.dispatchEvent(
      new CustomEvent(CellEvents.CellValueChange, {
        detail: { field: this.config?.name, oldValue, newValue },
        bubbles: true,
        composed: true,
        cancelable: true,
      })
    )
  }
}
