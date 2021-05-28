import { CSSResult, LitElement, PropertyValues, TemplateResult, html, property } from 'lit-element'
import { CellEvents, ColumnTypes, ValidityErrors } from '../enums'
import { ColumnConfig, TableChangeValueProperties, TableData } from '../interfaces'
import { KeyActions, keyMapper } from '../utils/key-mapper'

import { cellStyle } from '../assets/styles'

export abstract class AbstractM2TableCell<T> extends LitElement {
  @property({ type: Object }) config: ColumnConfig | any
  @property({ type: Object }) record?: TableData
  @property({ type: String }) value?: any
  @property({ type: Boolean }) _isEditing: boolean = false
  @property({ type: Boolean }) _isFocused: boolean = false

  @property({ type: Number, reflect: true }) rowIdx?: number
  @property({ type: Number, reflect: true }) columnIdx?: number
  @property({ type: Boolean, reflect: true }) invalid: boolean = false

  constructor(config: ColumnConfig) {
    super()
    this.config = config

    this.contentEditable = 'true'

    this.addEventListener('focus', this.onfocusHandler.bind(this), { capture: true })
    this.addEventListener('blur', this.onblurHandler.bind(this))
    this.addEventListener('dblclick', this.ondblclickHandler.bind(this))
    this.addEventListener('keydown', this.onkeydownHandler.bind(this))
  }

  static get styles(): CSSResult[] {
    return [cellStyle]
  }

  abstract editorAccessor: string
  abstract valueAccessKey: string
  abstract renderEditor(config: ColumnConfig): TemplateResult
  abstract renderDisplay(config: ColumnConfig): TemplateResult
  abstract focusOnEditor(): void

  abstract checkValidity(value?: any): void

  get isRequired(): boolean {
    if (typeof this.config.required === 'function') {
      return this.config.required(this.config, this.record || {}, this.value, this.changedRecord)
    } else {
      return Boolean(this.config.required)
    }
  }

  get editor(): T {
    const editor: T | null = this.renderRoot?.querySelector(this.editorAccessor) as any
    if (!editor) {
      throw new Error(`Failed to find editor by (${this.editorAccessor})`)
    }

    return editor
  }

  get changedRecord(): TableData {
    const changedRecord: TableData = { ...(this.record || {}) }
    if (this.record?.__props__?.changed) {
      this.record.__props__.changedValues?.forEach((changedValue: TableChangeValueProperties) => {
        changedRecord[changedValue.field] = changedValue.changes
      })
    }

    return changedRecord
  }

  render(): TemplateResult {
    if (!this.config) return html``
    return html` ${this._isEditing ? this.renderEditor(this.config) : this.renderDisplay(this.config)} `
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
        detail: { _isFocused: this._isFocused, cell: this },
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
    let editable: boolean

    const doDefaultAction: boolean = this.dispatchEvent(
      new CustomEvent(CellEvents.CellDblclick, {
        detail: {
          config: this.config,
          record: this.record,
          value: this.value,
          rowIdx: this.rowIdx,
          columnIdx: this.columnIdx,
        },
        bubbles: true,
        composed: true,
        cancelable: true,
      })
    )

    if (!doDefaultAction) return

    if (this.config?.editable !== undefined) {
      if (typeof this.config.editable === 'function') {
        editable = this.config.editable(this.config, this.record || {}, this.value, this.changedRecord)
      } else {
        editable = Boolean(this.config?.editable)
      }
    } else {
      editable = true
    }

    if (!editable) return

    this.toggleEditing()
  }

  /**
   * @description keydown event handler
   * @param event
   */
  onkeydownHandler(event: KeyboardEvent): void {
    if (keyMapper(event.code, KeyActions.TOGGLE_EDITING)) {
      const editable: boolean = this.checkEditable()
      if (!editable) return

      if (event.code === 'Enter') {
        event.preventDefault()
        this.toggleEditing(event.ctrlKey)
      }
    }

    if (this._isEditing && keyMapper(event.code, KeyActions.CANCEL_EDITING)) {
      this.cancelEditing()
    }
  }

  checkEditable(): boolean {
    let editable: boolean
    if (this.config?.editable !== undefined) {
      if (typeof this.config.editable === 'function') {
        editable = this.config.editable(this.config, this.record || {}, this.value, this.changedRecord)
      } else {
        editable = Boolean(this.config?.editable)
      }
    } else {
      editable = true
    }

    return editable
  }

  /**
   * @description toggle editing/displaying mode
   */
  async toggleEditing(continueNextRowEditing: boolean = false): Promise<void> {
    if (this._isEditing) {
      if (this.config.type === ColumnTypes.Textarea) return // Block to toggle editing if it's textarea to append new line

      this._isEditing = false
      this.setValue()

      if (continueNextRowEditing) {
        this.dispatchEditNextRowEvent()
      } else {
        this.focus()
      }
    } else {
      this._isEditing = true
      await this.updateComplete
      this.focusOnEditor()
    }
  }

  async cancelEditing(): Promise<void> {
    this._isEditing = false
    this.focus()
  }

  /**
   * @description set value if value is changed and dispatch valueChange custom event.
   */
  public async setValue(newValue?: any, ignoreEditable: boolean = true): Promise<void> {
    try {
      if (!ignoreEditable && !this.checkEditable()) return

      if (newValue === undefined) {
        newValue = this.getEditorValue()
      }

      this.doValidations(newValue)

      const oldValue: any = this.parseValue(this.value)
      if (oldValue != newValue) {
        this.value = newValue
        this.dispatchValueChangeEvent(oldValue, newValue)
      }
    } catch (e) {
      throw e
    }
  }

  getEditorValue(): any {
    return this.parseValue((this.editor as any)[this.valueAccessKey])
  }

  parseValue(value: any): any {
    return value
  }

  public clearValue(): void {
    this.value = ''
  }

  public doValidations(value: any): void {
    try {
      const validator:
        | RegExp
        | ((config: ColumnConfig, record: TableData, value: any, changedRecord: TableData) => void)
        | undefined = this.config.validator

      if (validator) {
        if (validator instanceof RegExp) {
          if (!validator.test(value)) throw new Error(ValidityErrors.PATTERN_MISMATCH)
        } else {
          validator(this.config, this.record || {}, value, this.changedRecord)
        }
      }
      this.checkValidity(value)

      this.invalid = false
    } catch (e) {
      this.invalid = true
      this.dispatchEvent(
        new CustomEvent(CellEvents.ValidationFailed, {
          detail: { config: this.config, value: this.value, record: this.record, error: e },
          bubbles: true,
          composed: true,
          cancelable: true,
        })
      )

      throw e
    }
  }

  displayCellFactory(innerText: string | number | TemplateResult | undefined): TemplateResult {
    if (innerText === undefined) {
      innerText = ''
    }

    return html` <div class="dsp-cell"><span>${innerText}</span></div> `
  }

  dispatchValueChangeEvent(oldValue: any, newValue: any): void {
    this.dispatchEvent(
      new CustomEvent(CellEvents.CellValueChange, {
        detail: { field: this.config?.name, oldValue, newValue, rowIdx: this.rowIdx, columnIdx: this.columnIdx },
        bubbles: true,
        composed: true,
        cancelable: true,
      })
    )
  }

  dispatchEditNextRowEvent(): void {
    this.dispatchEvent(
      new CustomEvent(CellEvents.EditNextRow, {
        detail: { field: this.config.name, rowIdx: this.rowIdx, cell: this },
        bubbles: true,
        composed: true,
        cancelable: true,
      })
    )
  }

  dispatchEditNextColumnEvent(): void {
    this.dispatchEvent(
      new CustomEvent(CellEvents.EditNextColumn, {
        detail: { field: this.config.name, rowIdx: this.rowIdx, cell: this },
        bubbles: true,
        composed: true,
        cancelable: true,
      })
    )
  }
}
