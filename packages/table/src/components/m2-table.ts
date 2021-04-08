import './m2-table-body'
import './m2-table-footer'
import './m2-table-header'
import './m2-table-page-indicator'

import { AbstractM2TableCell, AbstractM2TablePart } from '../abstracts'
import { CSSResult, TemplateResult, css, customElement, html, property } from 'lit-element'
import { ColumnConfig, TableData } from '../interfaces'

import { M2TableBody } from './m2-table-body'
import { M2TableBooleanCell } from './m2-table-boolean-cell'
import { M2TableDateCell } from './m2-table-date-cell'
import { M2TableDateTimeCell } from './m2-table-datetime-cell'
import { M2TableFloatCell } from './m2-table-float-cell'
import { M2TableHeader } from './m2-table-header'
import { M2TableImageCell } from './m2-table-image-cell'
import { M2TableIntegerCell } from './m2-table-integer-cell'
import { M2TableObjectCell } from './m2-table-object-cell'
import { M2TableSelectCell } from './m2-table-select-cell'
import { M2TableStringCell } from './m2-table-string-cell'

export type M2TableFetchResult = {
  data: any[]
  total: number
}

export type M2TableCellTypes =
  | M2TableBooleanCell
  | M2TableDateCell
  | M2TableDateTimeCell
  | M2TableFloatCell
  | M2TableImageCell
  | M2TableIntegerCell
  | M2TableObjectCell
  | M2TableSelectCell
  | M2TableStringCell

@customElement('m2-table')
export class M2Table extends AbstractM2TablePart {
  @property({ type: Array }) data: any[] = []
  @property({ type: Number }) total?: number
  @property({ type: Number }) scrollSpeedLevel: number = 1
  @property({ type: Number }) limit: number = 50
  @property({ type: Array }) selectedData: Record<string, any>[] = []

  private page: number = 1

  @property({ type: Object }) fetchHandler?: (page: number, limit: number) => Promise<M2TableFetchResult>

  static get styles(): CSSResult[] {
    return [
      css`
        :host {
          display: flex;
          flex: 1;
          flex-direction: column;
          overflow: hidden;
        }
        #table-container {
          display: flex;
          flex: 1;
          flex-direction: column;
          overflow: auto hidden;
        }
      `,
    ]
  }

  render(): TemplateResult {
    return html`
      <div id="table-container">
        <m2-table-header
          .columns="${this.columns}"
          .buttons="${this.buttons}"
          .selectable="${this.selectable}"
          .scrollSpeedLevel="${this.scrollSpeedLevel}"
          .minColumnWidth="${this.minColumnWidth}"
          .maxColumnWidth="${this.maxColumnWidth}"
          .enableBulkEdit="${this.enableBulkEdit}"
          @selectAll="${this.onSelectAllHandler.bind(this)}"
          @deselectAll="${this.onDeselectAllHandler.bind(this)}"
          @wheel="${this.onHeaderWheelHandler}"
          @columnWidthChange="${this.onColumnWidthChange.bind(this)}"
        ></m2-table-header>

        <m2-table-body
          .selectable="${this.selectable}"
          .addable="${this.addable}"
          .removable="${this.removable}"
          .columns="${this.columns}"
          .buttons="${this.buttons}"
          .startRowNumber="${(this.page - 1) * this.limit}"
          .data="${this.data}"
          .selectedData="${this.selectedData}"
        ></m2-table-body>
      </div>

      <m2-table-footer>
        ${this.total !== undefined
          ? html`
              <m2-table-page-indicator
                .total="${this.total}"
                .limit="${this.limit}"
                @pageChanged="${(e: CustomEvent) => {
                  this.page = e.detail.page
                  this.limit = e.detail.limit
                  if (this.fetchHandler) this.refreshData()
                }}"
              ></m2-table-page-indicator>
            `
          : ''}
      </m2-table-footer>
    `
  }

  async firstUpdated(): Promise<void> {
    if (this.fetchHandler) {
      this.refreshData()
    }
  }

  async refreshData(): Promise<void> {
    if (this.fetchHandler) {
      const { data, total } = await this.fetchHandler(this.page, this.limit)
      this.data = data
      this.total = total
    } else {
      throw new Error('Fetch handler is not defined')
    }
  }

  get tableContainer(): HTMLDivElement {
    const tableContainer: HTMLDivElement | null = this.renderRoot.querySelector<HTMLDivElement>('#table-container')
    if (!tableContainer) throw new Error('Failed to find table container')
    return tableContainer
  }

  get tableHeader(): M2TableHeader | null {
    return this.renderRoot?.querySelector('m2-table-header')
  }

  get tableBody(): M2TableBody | null {
    return this.renderRoot?.querySelector('m2-table-body')
  }

  selectAll(): void {
    this.tableBody?.selectAll()
  }

  selectRow(rowIdx: number): void {
    this.tableBody?.selectRow(rowIdx)
  }

  deselectAll(): void {
    this.tableBody?.deselectAll()
  }

  deselectRow(rowIdx: number): void {
    this.tableBody?.deselectRow(rowIdx)
  }

  getRecords<T>(withProps: boolean = false): (T & TableData)[] {
    if (!this.tableBody) {
      throw new Error('tableBody is not exists')
    }

    return this.tableBody.getRecords(withProps) as (T & TableData)[]
  }

  /**
   * @description Returning selected data
   * @param withProps Whether __props__ of data is involved or not
   */
  getSelected<T>(withProps: boolean = false): (T & TableData)[] {
    if (!this.tableBody) {
      throw new Error('tableBody is not exists')
    }

    return this.tableBody.getSelected(withProps) as (T & TableData)[]
  }

  /**
   * @description Returning changed data with non changed field of data as well
   * @param withProps Whether __props__ of data is involved or not
   * @returns {(T & TableData)[]}
   */
  getChanged<T>(withProps: boolean = false): (T & TableData)[] {
    if (!this.tableBody) {
      throw new Error('tableBody is not exists')
    }

    return this.tableBody.getChanged(withProps) as (T & TableData)[]
  }

  /**
   * @description Returning changed data with only changed fields of data
   * @returns {TableData[]}
   */
  getChangedOnly<T>(): (T & TableData)[] {
    if (!this.tableBody) {
      throw new Error('tableBody is not exists')
    }

    return this.tableBody.getChangedOnly() as (T & TableData)[]
  }

  /**
   * @description Returning appended data (Newly added)
   * @param withProps Whether __props__ of data is involved or not
   * @returns {TableData[]}
   */
  getAppended<T>(withProps: boolean = false): (T & TableData)[] {
    if (!this.tableBody) {
      throw new Error('tableBody is not exists')
    }

    return this.tableBody.getAppended(withProps) as (T & TableData)[]
  }

  /**
   * @description Returning deleted data
   * (Appended data will be deleted automatically when user press delete button (If key map is configured  as default)
   * but the deleting target data is not appended one, it will change the status of data and user can get those data by this function
   * @param withProps Whether __props__ of data is involved or not
   * @returns {TableData[]}
   */
  getDeleted<T>(withProps: boolean = false): (T & TableData)[] {
    if (!this.tableBody) {
      throw new Error('tableBody is not exists')
    }

    return this.tableBody.getDeleted(withProps) as (T & TableData)[]
  }

  getCell<T>(rowIdx: number, columnName: string): T {
    const columnIdx: number = this.columns.findIndex((column: ColumnConfig) => column.name === columnName)
    if (columnIdx < 0) throw new Error('Failed to find column by name')
    return this.tableBody?.getRow(rowIdx).querySelector(`m2-table-cell[columnidx="${columnIdx}"]`).renderRoot
      .firstElementChild
  }

  /**
   * @description Event handler for selectAll from m2-table-header
   */
  onSelectAllHandler(): void {
    this.tableBody?.selectAll()
  }

  /**
   * @description Event handler for deselectAll from m2-table-header
   */
  onDeselectAllHandler(): void {
    this.tableBody?.deselectAll()
  }

  /**
   * @description Event handler for wheel from m2-table-header, It scrolls table from left to right
   * @param e Wheel Event
   */
  onHeaderWheelHandler(e: WheelEvent): void {
    this.tableContainer.scrollLeft += e.deltaY / this.scrollSpeedLevel
  }

  onColumnWidthChange(e: CustomEvent): void {
    const { columnIdx, width } = e.detail
    this.columns = this.columns.map((column: ColumnConfig, idx: number) => {
      if (idx === columnIdx) {
        column.width = width
      }

      return column
    })
  }

  checkValidity(): void {
    for (let rowIdx: number = 0; rowIdx < this.data.length; rowIdx++) {
      for (let columnIdx: number = 0; columnIdx < this.columns.length; columnIdx++) {
        const columnName: string = this.columns[columnIdx].name
        const cell: AbstractM2TableCell<any> = this.getCell<AbstractM2TableCell<any>>(rowIdx, columnName)

        try {
          cell.doValidations(cell.value)
        } catch (e) {
          throw e
        }
      }
    }
  }
}
