import './m2-table-boolean-cell'
import './m2-table-float-cell'
import './m2-table-integer-cell'
import './m2-table-object-cell'
import './m2-table-string-cell'

import {
  BooleanColumnConfig,
  ColumnConfig,
  FloatColumnConfig,
  NumberColumnConfig,
  SelectColumnConfig,
  StringColumnConfig,
} from '../interfaces'
import {
  CSSResult,
  LitElement,
  TemplateResult,
  css,
  customElement,
  html,
  property,
} from 'lit-element'

import { ColumnTypes } from '../enums'

@customElement('m2-table-cell')
export class M2TableCell extends LitElement {
  @property({ type: String }) type?: ColumnTypes
  @property({ type: Object }) config?: ColumnConfig
  @property() value: any
  @property({ type: Boolean }) _isFocused: boolean = false
  @property({ type: Number }) rowIdx: number = -1
  @property({ type: Number }) columnIdx: number = -1
  @property({ type: Object }) TAG_MAPPER: Record<ColumnTypes, string> = {
    [ColumnTypes.Boolean]: 'm2-table-boolean-cell',
    [ColumnTypes.Float]: 'm2-table-float-cell',
    [ColumnTypes.Integer]: 'm2-table-integer-cell',
    [ColumnTypes.Object]: 'm2-table-object-cell',
    [ColumnTypes.String]: 'm2-table-string-cell',
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
  constructor() {
    super()
    this.contentEditable = 'true'
  }

  render(): TemplateResult {
    this.value = this.value || ''
    return html`
      ${this.type === ColumnTypes.String
        ? html`
            <m2-table-string-cell
              class="${this._computeClasses(this.config)}"
              .config="${this.config as StringColumnConfig}"
              .value="${String(this.value)}"
            ></m2-table-string-cell>
          `
        : this.type === ColumnTypes.Boolean
        ? html`
            <m2-table-boolean-cell
              class="${this._computeClasses(this.config)}"
              .config="${this.config as BooleanColumnConfig}"
              .value="${Boolean(this.value)}"
            ></m2-table-boolean-cell>
          `
        : this.type === ColumnTypes.Float
        ? html`
            <m2-table-float-cell
              class="${this._computeClasses(this.config)}"
              .config="${this.config as FloatColumnConfig}"
              .value="${Number(this.value)}"
            ></m2-table-float-cell>
          `
        : this.type === ColumnTypes.Integer
        ? html`
            <m2-table-integer-cell
              class="${this._computeClasses(this.config)}"
              .config="${this.config as NumberColumnConfig}"
              .value="${Number(this.value)}"
            ></m2-table-integer-cell>
          `
        : this.type === ColumnTypes.Object
        ? html`
            <m2-table-object-cell
              class="${this._computeClasses(this.config)}"
              .config="${this.config as SelectColumnConfig}"
              .value="${this.value}"
            ></m2-table-object-cell>
          `
        : html` <m2-table-string-cell
            class="${this._computeClasses(this.config)}"
            .config="${this.config as StringColumnConfig}"
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
