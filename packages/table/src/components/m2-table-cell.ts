import './m2-table-boolean-cell'
import './m2-table-float-cell'
import './m2-table-integer-cell'
import './m2-table-object-cell'
import './m2-table-select-cell'
import './m2-table-string-cell'
import './m2-table-datetime-cell'

import {
  CSSResult,
  LitElement,
  TemplateResult,
  css,
  customElement,
  html,
  property,
} from 'lit-element'

import { ColumnConfig } from '../interfaces'
import { ColumnTypes } from '../enums'

@customElement('m2-table-cell')
export class M2TableCell extends LitElement {
  @property({ type: String }) type?: ColumnTypes
  @property({ type: Object }) config: ColumnConfig
  @property() value: any
  @property({ type: Boolean }) _isFocused: boolean = false
  @property({ type: Number }) rowIdx: number = -1
  @property({ type: Number }) columnIdx: number = -1
  @property({ type: Object }) TAG_MAPPER: Record<ColumnTypes, string> = {
    [ColumnTypes.Boolean]: 'm2-table-boolean-cell',
    [ColumnTypes.Float]: 'm2-table-float-cell',
    [ColumnTypes.Integer]: 'm2-table-integer-cell',
    [ColumnTypes.Select]: 'm2-table-select-cell',
    [ColumnTypes.String]: 'm2-table-string-cell',
    [ColumnTypes.Object]: 'm2-table-object-cell',
    [ColumnTypes.DateTime]: 'm2-table-datetime-cell',
  }

  static get styles(): CSSResult {
    return css`
      :host {
        display: flex;
        outline: none;
        width: inherit;
      }
    `
  }

  /**
   * @description set contentEditable to 'true' foe being able to focused on at this component
   */
  constructor(config: ColumnConfig) {
    super()
    this.contentEditable = 'true'
    this.config = config
  }

  render(): TemplateResult {
    this.value = this.value || ''
    return html`
      ${this.type === ColumnTypes.String
        ? html`
            <m2-table-string-cell
              class="${this._computeClasses(this.config)}"
              .config="${this.config}"
              .value="${String(this.value)}"
            ></m2-table-string-cell>
          `
        : this.type === ColumnTypes.Boolean
        ? html`
            <m2-table-boolean-cell
              class="${this._computeClasses(this.config)}"
              .config="${this.config}"
              .value="${Boolean(this.value)}"
            ></m2-table-boolean-cell>
          `
        : this.type === ColumnTypes.Float
        ? html`
            <m2-table-float-cell
              class="${this._computeClasses(this.config)}"
              .config="${this.config}"
              .value="${Number(this.value)}"
            ></m2-table-float-cell>
          `
        : this.type === ColumnTypes.Integer
        ? html`
            <m2-table-integer-cell
              class="${this._computeClasses(this.config)}"
              .config="${this.config}"
              .value="${Number(this.value)}"
            ></m2-table-integer-cell>
          `
        : this.type === ColumnTypes.Select
        ? html`
            <m2-table-select-cell
              class="${this._computeClasses(this.config)}"
              .config="${this.config}"
              .value="${this.value}"
            ></m2-table-select-cell>
          `
        : this.type === ColumnTypes.Object
        ? html`
            <m2-table-object-cell
              class="${this._computeClasses(this.config)}"
              .config="${this.config}"
              .value="${this.value}"
            >
            </m2-table-object-cell>
          `
        : this.type === ColumnTypes.DateTime
        ? html`
            <m2-table-datetime-cell
              class="${this._computeClasses(this.config)}"
              .config="${this.config}"
              .value="${Number(this.value)}"
            >
            </m2-table-datetime-cell>
          `
        : html` <m2-table-string-cell
            class="${this._computeClasses(this.config)}"
            .config="${this.config}"
            .value="${String(this.value)}"
          ></m2-table-string-cell>`}
    `
  }

  get cell(): any {
    if (!this.type) throw new Error('cell type is not defined')
    const tag: string = this.TAG_MAPPER[this.type]
    if (!tag) {
      throw new Error(
        `Failed to find cell by '${this.type}' type, the type may not be supported`
      )
    }

    return this.renderRoot?.querySelector(this.TAG_MAPPER[this.type])
  }

  /**
   * @description Set class list for every single cell
   * currently alignment for insert text of cell is only supported.
   * @param config Object having class list
   */
  _computeClasses(config?: ColumnConfig): string {
    const { align } = config || {}
    let classes: string[] = []
    if (align) classes.push(align)

    return classes.join(' ')
  }
}
