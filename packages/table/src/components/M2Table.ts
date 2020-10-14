import {
  css,
  CSSResult,
  customElement,
  html,
  property,
  TemplateResult,
} from 'lit-element'
import { AbstractM2TablePart } from '../abstracts'
import { TableDataInterface } from '../interfaces'
import './M2TableBody'
import { M2TableBody } from './M2TableBody'
import './M2TableFooter'
import './M2TableHeader'
import { M2TableHeader } from './M2TableHeader'

@customElement('m2-table')
export class M2Table extends AbstractM2TablePart {
  @property({ type: Array }) data: object[] = []
  @property({ type: Number }) scrollSpeedLevel: number = 1

  static get styles(): CSSResult[] {
    return [
      css`
        :host {
          display: flex;
          flex: 1;
          flex-direction: column;
          overflow: hidden;
        }
      `,
    ]
  }

  render(): TemplateResult {
    return html`
      <m2-table-header
        .columns="${this.columns}"
        .buttons="${this.buttons}"
        .scrollSpeedLevel="${this.scrollSpeedLevel}"
        @selectAll="${this.onSelectAllHandler.bind(this)}"
        @deselectAll="${this.onDeselectAllHandler.bind(this)}"
        @wheel="${this.onHeaderWheelHandelr}"
      ></m2-table-header>

      <m2-table-body
        .appendable="${this.appendable}"
        .deletable="${this.deletable}"
        .columns="${this.columns}"
        .buttons="${this.buttons}"
        .data="${this.data}"
      ></m2-table-body>

      <m2-table-footer></m2-table-footer>
    `
  }

  get tableHeader(): M2TableHeader | null {
    return this.renderRoot?.querySelector('m2-table-header')
  }

  get tableBody(): M2TableBody | null {
    return this.renderRoot?.querySelector('m2-table-body')
  }

  /**
   * @description Returning selected data
   * @param withProps Whether __props__ of data is involved or not
   */
  getSelected(withProps: boolean = false): TableDataInterface[] | void {
    return this.tableBody?.getSelected(withProps)
  }

  /**
   * @description Returning changed data with non changed field of data as well
   * @param withProps Whether __props__ of data is involved or not
   * @returns {TableDataInterface[]}
   */
  getChanged(withProps: boolean = false): TableDataInterface[] | void {
    return this.tableBody?.getChanged(withProps)
  }

  /**
   * @description Returning changed data with only changed fields of data
   * @returns {TableDataInterface[]}
   */
  getChangedOnly(): TableDataInterface[] | void {
    return this.tableBody?.getChangedOnly()
  }

  /**
   * @description Returning appeneded data (Newly added)
   * @param withProps Whether __props__ of data is involved or not
   * @returns {TableDataInterface[]}
   */
  getAppended(withProps: boolean = false): TableDataInterface[] | void {
    return this.tableBody?.getAppended(withProps)
  }

  /**
   * @description Returning deleted data
   * (Appeneded data will be deleted automatically when user press delete button (If key map is configured  as default)
   * but the deleting target data is not appeneded one, it will change the status of data and user can get those data by this function
   * @param withProps Whether __props__ of data is involved or not
   * @returns {TableDataInterface[]}
   */
  getDeleted(withProps: boolean = false): TableDataInterface[] | void {
    return this.tableBody?.getDeleted(withProps)
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
   * @description Event handler for wheel from m2-table-header, It scrolls tabel from left to right
   * @param e Wheel Event
   */
  onHeaderWheelHandelr(e: WheelEvent) {
    this.scrollLeft += e.deltaY / this.scrollSpeedLevel
  }
}
