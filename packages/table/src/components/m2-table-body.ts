import './m2-table-cell'

import { ButtonType, DataStatus, Events } from '../enums'
import {
  CSSResult,
  PropertyValues,
  TemplateResult,
  customElement,
  html,
  property,
} from 'lit-element'
import {
  ColumnConfig,
  IconButtonOptions,
  TableButton,
  TableChangeValueProperties,
  TableData,
  TextButtonOptions,
} from '../interfaces'
import { KeyActions, keyMapper } from '../utils/key-mapper'

import { AbstractM2TablePart } from '../abstracts'
import { M2TableCell } from './m2-table-cell'
import { bodyStyle } from '../assets/styles'

@customElement('m2-table-body')
export class M2TableBody extends AbstractM2TablePart {
  @property({ type: Array }) data: TableData[] = []
  @property({ type: Object }) focusedCell?: HTMLElement
  @property({ type: Boolean }) _isEditing: boolean = false
  @property({ type: Object }) _focusedCell?: M2TableCell
  @property({ type: Object }) private _data: TableData = []

  static get styles(): CSSResult[] {
    return [bodyStyle]
  }

  private propertyAccessKey: string = '__props__'

  constructor() {
    super()
    this.addEventListener('keydown', this.onkeydownHandler.bind(this))
    this.addEventListener('valueChange', this.onValueChangeHandler.bind(this))
  }

  render(): TemplateResult {
    return html`
      <tbody>
        ${this._data.map(
          (record: TableData, rowIdx: number) => html`
            <tr
              rowIdx="${rowIdx}"
              ?changed="${record?.[this.propertyAccessKey]?.changed || false}"
              ?appended="${record?.[this.propertyAccessKey]?.appended || false}"
              ?deleted="${record?.[this.propertyAccessKey]?.deleted || false}"
              ?selected="${record?.[this.propertyAccessKey]?.selected || false}"
              @dblclick="${this.onDblClickHandler}"
            >
              ${this.selectable ? this.renderSelectInput(rowIdx, record) : ''}
              ${this.numbering ? this.renderRowNumbering(rowIdx) : ''}
              ${this.buttons.map((button: TableButton) =>
                this.renderButton(button, record)
              )}
              ${this.columns.map((column: ColumnConfig, columnIdx: number) =>
                this.renderTableCell(column, record, rowIdx, columnIdx)
              )}
            </tr>
          `
        )}
      </tbody>
    `
  }

  private renderRowNumbering(rowIdx: number): TemplateResult {
    return html`
      <td class="row-numbering" width="30">
        <span class="row-num">${rowIdx + 1}.</span>
      </td>
    `
  }

  private renderSelectInput(rowIdx: number, record: TableData): TemplateResult {
    return html`<td>
      <input
        rowIdx="${rowIdx}"
        type="checkbox"
        @change="${this.onSelecterChangeHandler.bind(this)}"
        .checked="${record?.[this.propertyAccessKey]?.selected || false}"
      />
    </td>`
  }

  private renderButton(
    button: TableButton,
    record: TableData
  ): TemplateResult | void {
    if (button.type === ButtonType.Icon) {
      let icon: any
      const buttonOptions: IconButtonOptions = button.options as IconButtonOptions
      if (typeof buttonOptions.icon === 'function') {
        icon = icon as HTMLElement
        icon = buttonOptions.icon(record)
      } else {
        icon = new Image()
        icon.src = buttonOptions.icon
      }

      return html`<td>
        <button
          @click="${() => {
            const handler: any = buttonOptions?.handlers?.click
            if (handler && typeof handler === 'function') {
              handler(record)
            }
          }}"
          @dblclick="${() => {
            const handler: any = buttonOptions?.handlers?.dblclick
            if (handler && typeof handler === 'function') {
              handler(record)
            }
          }}"
        >
          ${icon}
        </button>
      </td>`
    } else if (button.type === ButtonType.Text) {
      const buttonOptions: TextButtonOptions = button.options as TextButtonOptions

      let text: any
      if (typeof buttonOptions.text === 'function') {
        text = buttonOptions.text(record)
      } else {
        text = buttonOptions.text
      }

      return html` <td>
        <button
          @click="${() => {
            const handler: any = buttonOptions?.handlers?.click
            if (handler && typeof handler === 'function') {
              handler(record)
            }
          }}"
          @dblclick="${() => {
            const handler: any = buttonOptions?.handlers?.click
            if (handler && typeof handler === 'function') {
              handler(record)
            }
          }}"
        >
          ${text}
        </button>
      </td>`
    }
  }

  private renderTableCell(
    column: ColumnConfig,
    record: TableData,
    rowIdx: number,
    columnIdx: number
  ): TemplateResult {
    return html` <td
      width="${column.width || '150px'}"
      ?hidden="${column.hidden}"
    >
      <m2-table-cell
        rowIdx="${rowIdx}"
        columnIdx="${columnIdx}"
        .type="${column.type}"
        .config="${column}"
        .value="${record[column.name]}"
        @modeChange="${this.onModeChangeHandler}"
        @focusChange="${this.onFocusChangeHandler}"
      ></m2-table-cell>
    </td>`
  }

  updated(changedProps: PropertyValues): void {
    if (changedProps.has('data') || changedProps.has('addable')) {
      this._data = []
      this._data = this.data.map((record: TableData) => {
        let cloned: TableData = Object.assign({}, record)
        delete cloned[this.propertyAccessKey]
        return cloned
      })
      if (this.data?.length === 0 && this.addable) {
        this.appendData()
      }
    }
  }

  /**
   * @description Returning selected data rows
   * @param withProps Whether this.propertyAccessKey of data is involved or not
   * @returns {TableData[]} selected data list
   */
  getSelected(withProps: boolean = false): TableData[] {
    let selectedData: TableData[] = this._data.filter(
      (record: TableData) => record?.[this.propertyAccessKey]?.selected
    )

    if (!withProps) {
      selectedData = selectedData.map((record: TableData) => {
        let cloned: TableData = Object.assign({}, record)
        delete cloned[this.propertyAccessKey]
        return cloned
      })
    }

    return selectedData
  }

  /**
   * @description Getting changes of specific data by row index
   * @param rowIdx
   * @returns {TableChangeValueProperties[]} changed value properties
   */
  getChangesByRowIdx(rowIdx: number): TableChangeValueProperties[] | null {
    return this._data[rowIdx]?.[this.propertyAccessKey]?.changedValues || null
  }

  /**
   * @description Returning changed data with non changed field of data as well
   * @param withProps Whether this.propertyAccessKey of data is involved or not
   * @returns {TableData[]}
   */
  getChanged(withProps: boolean = false): TableData[] {
    let changedData: TableData[] = this.getDataByStatus(
      DataStatus.Changed,
      true
    )
    return changedData.map((record: TableData) => {
      let clone: TableData = Object.assign({}, record)
      const changedValues: TableChangeValueProperties[] | undefined =
        clone[this.propertyAccessKey]?.changedValues
      if (changedValues?.length) {
        changedValues.forEach((changedValue: TableChangeValueProperties) => {
          clone[changedValue.field] = changedValue.changes
        })
      }

      return clone
    })
  }

  /**
   * @description Returning changed data with only changed fields of data
   * @returns {TableData[]}
   */
  getChangedOnly(): TableData[] {
    const changedData: TableData = this.getDataByStatus(
      DataStatus.Changed,
      true
    )
    return changedData.map((record: TableData) => {
      let extractedRecord = record?.[
        this.propertyAccessKey
      ]?.changedValues?.reduce(
        (
          changedData: TableData,
          changedValue: TableChangeValueProperties
        ): TableData => {
          changedData[changedValue.field] = changedValue.changes
          return changedData
        },
        {}
      )

      return {
        ...this.getPrimaryField(record),
        ...extractedRecord,
      }
    })
  }

  /**
   * @description Returning appeneded data (Newly added)
   * @param withProps Whether this.propertyAccessKey of data is involved or not
   * @returns {TableData[]}
   */
  getAppended(withProps: boolean = false): TableData[] {
    return this.getDataByStatus(DataStatus.Appended, withProps)
  }

  /**
   * @description Returning deleted data
   * (Appeneded data will be deleted automatically when user press delete button (If key map is configured  as default)
   * but the deleting target data is not appeneded one, it will change the status of data and user can get those data by this function
   * @param withProps Whether this.propertyAccessKey of data is involved or not
   * @returns {TableData[]}
   */
  getDeleted(withProps: boolean = false): TableData[] {
    return this.getDataByStatus(DataStatus.Deleted, withProps)
  }

  /**
   * @description Returning data which has status as its status
   * @param status {DataStatus} Status of target data to get
   * @param withProps Whether this.propertyAccessKey of data is involved or not
   * @returns {TableData[]}
   */
  getDataByStatus(status: DataStatus, withProps: boolean = false): TableData[] {
    let filteredData: TableData[] = this._data
      .filter(
        (record: TableData) =>
          record?.[this.propertyAccessKey]?.[status] &&
          Object.keys(record).filter(
            (key: string) => key !== this.propertyAccessKey
          ).length
      )
      .map((record: TableData) => {
        const cloned: TableData = Object.assign({}, record)
        if (!withProps) delete cloned[this.propertyAccessKey]

        const keys: string[] = Object.keys(record)
        keys.forEach((key: string) => {
          if (!cloned[key]) {
            delete cloned[key]
          }
        })

        return cloned
      })

    return filteredData
  }

  /**
   * @description When the columns involves a column which has primary property
   * Returning object of primary key and value pair
   * @param record
   * @returns {TableData}
   */
  private getPrimaryField(record: TableData): TableData {
    const primaryColumn: ColumnConfig | undefined = this.columns.find(
      (column: ColumnConfig) => column.primary
    )
    if (primaryColumn) {
      return { [primaryColumn.name]: record[primaryColumn.name] }
    } else {
      return {}
    }
  }

  /**
   * @description select true for every current row of indicator.
   */
  selectAll(): void {
    this._data = this._data.map(
      (record: TableData): TableData => {
        return {
          ...record,
          [this.propertyAccessKey]: {
            ...record[this.propertyAccessKey],
            selected: true,
          },
        }
      }
    )
  }

  /**
   * @description deselect to false for every current row of indicator
   */
  deselectAll(): void {
    this._data = this._data.map(
      (record: TableData): TableData => {
        return {
          ...record,
          [this.propertyAccessKey]: {
            ...record[this.propertyAccessKey],
            selected: false,
          },
        }
      }
    )
  }

  /**
   * @description modeChange event handler
   * @param e
   */
  onModeChangeHandler(e: CustomEvent): void {
    this._isEditing = e.detail._isEditing
  }

  /**
   * @description focusChange event handler
   * @param e
   */
  onFocusChangeHandler(e: CustomEvent): void {
    this._focusedCell = e.currentTarget as M2TableCell
  }

  /**
   * @description change handler of select input
   * @param e
   */
  onSelecterChangeHandler(e: InputEvent): void {
    const checkbox: HTMLInputElement = e.currentTarget as HTMLInputElement
    const rowIdx: number = Number(checkbox.getAttribute('rowIdx'))
    const checked: boolean = checkbox.checked

    if (checked) {
      this.selectRow(rowIdx)
    } else {
      this.deselectRow(rowIdx)
    }
  }

  onDblClickHandler(e: MouseEvent) {
    this.dispatchEvent(
      new CustomEvent(Events.RowDblClick, {
        bubbles: true,
        composed: true,
        cancelable: true,
      })
    )
  }

  /**
   * @description keypress event handler to fire action by keypressing
   * @param event
   */
  onkeydownHandler(event: KeyboardEvent): void {
    const key: string = event.code
    if (keyMapper(key, KeyActions.MOVE_FOCUSING))
      this.moveFocusingKeyHandler(key)
    if (keyMapper(key, KeyActions.SELECT_ROW)) this.selectRowKeyHandler()
    if (keyMapper(key, KeyActions.DELETE_ROW)) this.deleteRowKeyHandler()
  }

  private moveFocusingKeyHandler(key: string) {
    if (this._focusedCell && !this._isEditing) {
      this.moveFocusByKeycode(this._focusedCell, key)
    }
  }

  private selectRowKeyHandler() {
    if (this._focusedCell && this.selectable && !this._isEditing) {
      const rowIdx: number = this._focusedCell.rowIdx
      const isSelected: boolean =
        this._data[rowIdx]?.[this.propertyAccessKey]?.selected || false
      if (isSelected) {
        this.deselectRow(rowIdx)
      } else {
        this.selectRow(rowIdx)
      }
    }
  }

  private deleteRowKeyHandler() {
    if (this._focusedCell && !this._isEditing) {
      const rowIdx: number = this._focusedCell.rowIdx
      this.deleteRow(rowIdx)
    }
  }

  /**
   * @description Move focussing by pressed key
   * @param focusedCell
   * @param key
   */
  moveFocusByKeycode(focusedCell: M2TableCell, key: string) {
    if (keyMapper(key, KeyActions.MOVE_FOCUSING_LEFT)) {
      this.moveFocusLeft(focusedCell)
    } else if (keyMapper(key, KeyActions.MOVE_FOCUSING_UP)) {
      this.moveFocusUp(focusedCell)
    } else if (keyMapper(key, KeyActions.MOVE_FOCUSING_RIGHT)) {
      this.moveFocusRight(focusedCell)
    } else if (keyMapper(key, KeyActions.MOVE_FOCUSING_DOWN)) {
      this.moveFocusDown(focusedCell)
    }
  }

  /**
   * @description Move focussing from current to left
   * @param focusedCell
   */
  moveFocusLeft(focusedCell: M2TableCell): void {
    const rowIdx: number = focusedCell.rowIdx
    const columnIdx: number = focusedCell.columnIdx - 1

    if (this.isFocusMovable(rowIdx, columnIdx)) {
      this.getTableCellByIndex(rowIdx, columnIdx).cell.focus()
    }
  }

  /**
   * @description Checing whether there's more movable row/column or not
   * @param rowIdx
   * @param columnIdx
   */
  private isFocusMovable(rowIdx: number, columnIdx: number): boolean {
    return (
      columnIdx >= 0 &&
      rowIdx >= 0 &&
      columnIdx <= this.columns.length - 1 &&
      rowIdx <= this._data.length - 1
    )
  }

  /**
   * @description Move focussing from current to up
   * @param focusedCell
   */
  moveFocusUp(focusedCell: M2TableCell): void {
    const rowIdx: number = focusedCell.rowIdx - 1
    const columnIdx: number = focusedCell.columnIdx

    if (this.isFocusMovable(rowIdx, columnIdx)) {
      this.getTableCellByIndex(rowIdx, columnIdx).cell.focus()
    }
  }

  /**
   * @description Move focussing from current to riught
   * @param focusedCell
   */
  moveFocusRight(focusedCell: M2TableCell): void {
    const rowIdx: number = focusedCell.rowIdx
    const columnIdx: number = focusedCell.columnIdx + 1

    if (this.isFocusMovable(rowIdx, columnIdx)) {
      this.getTableCellByIndex(rowIdx, columnIdx).cell.focus()
    }
  }

  /**
   * @description Move focussing from current to down
   * If there's no more data downside, check the table is appendable and if it can create new data row
   * @param focusedCell
   */
  async moveFocusDown(focusedCell: M2TableCell): Promise<void> {
    const rowIdx: number = focusedCell.rowIdx + 1
    const columnIdx: number = focusedCell.columnIdx

    if (rowIdx > this._data.length - 1 && this.addable) {
      await this.appendData()
    }

    if (this.isFocusMovable(rowIdx, columnIdx)) {
      this.getTableCellByIndex(rowIdx, columnIdx).cell.focus()
    }
  }

  /**
   * @description append (push) new row into data of table
   */
  private async appendData(): Promise<void> {
    this._data.push({ [this.propertyAccessKey]: { appended: true } })
    await this.requestUpdate()
  }

  /**
   * @description Delete row by row index if this.deletable = true
   * If target row is appended => delete it
   * If target row is not appended one => flag up to be able to user knows (Soft delete)
   * @param rowIdx
   */
  async deleteRow(rowIdx: number): Promise<void> {
    if (
      this._data[rowIdx]?.[this.propertyAccessKey]?.appended &&
      this._data?.length > 1
    ) {
      this._data.splice(rowIdx, 1)

      if (rowIdx === this._data.length && this._focusedCell) {
        this.moveFocusUp(this._focusedCell)
      }
    } else if (!this._data[rowIdx]?.[this.propertyAccessKey]?.appended) {
      if (this.removable) {
        this._data[rowIdx] = this.getAdjustedDeleted(this._data[rowIdx])
      }
    }

    await this.requestUpdate()
  }

  /**
   * @description Change property of data to notify data is selected
   * @param rowIdx
   */
  selectRow(rowIdx: number): void {
    this._data[rowIdx] = {
      ...this._data[rowIdx],
      [this.propertyAccessKey]: {
        ...this._data[rowIdx][this.propertyAccessKey],
        selected: true,
      },
    }

    this.requestUpdate()
  }

  /**
   * @description Change property of data back to deselected
   * @param rowIdx
   */
  deselectRow(rowIdx: number): void {
    this._data[rowIdx] = {
      ...this._data[rowIdx],
      [this.propertyAccessKey]: {
        ...this._data[rowIdx][this.propertyAccessKey],
        selected: false,
      },
    }

    this.requestUpdate()
  }

  /**
   * @description valueChange handler from m2-table-cell
   * Update changed value to data
   * @param event
   */
  onValueChangeHandler(event: any): void {
    if (this._focusedCell) {
      const rowIdx: number = this._focusedCell.rowIdx
      const field: string = event.detail.field
      const newValue: any = event.detail.newValue

      if (!this._data[rowIdx]?.[this.propertyAccessKey]?.appended) {
        this._data[rowIdx] = this.getAdjustedChanges(
          this._data[rowIdx],
          field,
          newValue
        )
      } else {
        this._data[rowIdx] = this.getAdjustedAppend(
          this._data[rowIdx],
          field,
          newValue
        )
      }
    }
  }

  /**
   * @description Checking new valus is changed from origin value
   * And it is changed, update status of record to changed.
   * @param record
   * @param field
   * @param newValue
   */
  getAdjustedChanges(
    record: TableData,
    field: string,
    newValue: any
  ): TableData {
    newValue = this.convertEmptyStringToNull(newValue)

    let changedValues: TableChangeValueProperties[] =
      record?.[this.propertyAccessKey]?.changedValues || []

    if (
      changedValues.find(
        (changedValue: TableChangeValueProperties) =>
          changedValue.field === field
      )
    ) {
      changedValues = changedValues
        .map((changedValue: TableChangeValueProperties) => {
          if (
            changedValue.field === field &&
            changedValue.origin !== newValue
          ) {
            changedValue.changes = newValue

            return changedValue
          } else if (changedValue.field !== field) {
            return changedValue
          }
        })
        .filter(Boolean) as TableChangeValueProperties[]
    } else {
      changedValues.push({
        field,
        origin: record[field],
        changes: newValue,
      })
    }

    return {
      ...record,
      [this.propertyAccessKey]: {
        ...record[this.propertyAccessKey],
        changed: Boolean(changedValues?.length),
        changedValues,
      },
    }
  }

  /**
   * @description Adjust record status to appended
   * @param record
   * @param field
   * @param appendedValue
   */
  getAdjustedAppend(
    record: TableData,
    field: string,
    appendedValue: any
  ): TableData {
    return {
      ...record,
      [field]: appendedValue,
      [this.propertyAccessKey]: {
        ...record[this.propertyAccessKey],
        appended: true,
      },
    }
  }

  /**
   * @description Adjust record status to deleted (Soft delete)
   * @param record
   */
  getAdjustedDeleted(record: TableData): TableData {
    return {
      ...record,
      [this.propertyAccessKey]: {
        ...record[this.propertyAccessKey],
        deleted: !Boolean(record[this.propertyAccessKey]?.deleted),
      },
    }
  }

  /**
   * @description Returning table row based on row index
   * @param rowIdx
   * @returns {HTMLTableRowElement}
   */
  private getTableRowByIndex(rowIdx: number): HTMLTableRowElement | null {
    return this.renderRoot?.querySelector(`tr[rowIdx="${rowIdx}"`)
  }

  /**
   * @description Returning specific cell by row index and column index
   * @param rowIdx
   * @param columnIdx
   */
  private getTableCellByIndex(rowIdx: number, columnIdx: number): any {
    return this.renderRoot?.querySelector(
      `m2-table-cell[rowIdx="${rowIdx}"][columnIdx="${columnIdx}"]`
    ) as M2TableCell
  }

  private convertEmptyStringToNull(value: any): any {
    if (typeof value === 'string' && value === '') {
      return null
    } else {
      value
    }
  }
}
