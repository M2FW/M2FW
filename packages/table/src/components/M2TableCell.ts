import {
  css,
  CSSResult,
  customElement,
  html,
  LitElement,
  property,
  TemplateResult,
} from 'lit-element'
import { ColumnTypes } from '../enums'
import {
  BooleanColumnConfigInterface,
  ColumnConfigInterface,
  FloatColumnConfigInterface,
  NumberColumnConfigInterface,
  SelectColumnConfigInterface,
  StringColumnConfigInterface,
} from '../interfaces'
import './M2TableBooleanCell'
import './M2TableFloatCell'
import './M2TableIntegerCell'
import './M2TableObjectCell'
import './M2TableStringCell'

@customElement('m2-table-cell')
export class M2TableCell extends LitElement {
  @property({ type: String }) type?: ColumnTypes
  @property({ type: Object }) config?: ColumnConfigInterface
  @property() value: any
  @property({ type: Boolean }) _isFocuseed: boolean = false
  @property({ type: Number }) rowIdx: number = -1
  @property({ type: Number }) columnIdx: number = -1
  @property({ type: Object }) TAG_MAPPER: Record<string, string> = {
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
              .config="${this.config as StringColumnConfigInterface}"
              .value="${String(this.value)}"
            ></m2-table-string-cell>
          `
        : this.type === ColumnTypes.Boolean
        ? html`
            <m2-table-boolean-cell
              class="${this._computeClasses(this.config)}"
              .config="${this.config as BooleanColumnConfigInterface}"
              .value="${Boolean(this.value)}"
            ></m2-table-boolean-cell>
          `
        : this.type === ColumnTypes.Float
        ? html`
            <m2-table-float-cell
              class="${this._computeClasses(this.config)}"
              .config="${this.config as FloatColumnConfigInterface}"
              .value="${Number(this.value)}"
            ></m2-table-float-cell>
          `
        : this.type === ColumnTypes.Integer
        ? html`
            <m2-table-integer-cell
              class="${this._computeClasses(this.config)}"
              .config="${this.config as NumberColumnConfigInterface}"
              .value="${Number(this.value)}"
            ></m2-table-integer-cell>
          `
        : this.type === ColumnTypes.Object
        ? html`
            <m2-table-object-cell
              class="${this._computeClasses(this.config)}"
              .config="${this.config as SelectColumnConfigInterface}"
              .value="${this.value}"
            ></m2-table-object-cell>
          `
        : html` <m2-table-string-cell
            class="${this._computeClasses(this.config)}"
            .config="${this.config as StringColumnConfigInterface}"
            .value="${String(this.value)}"
          ></m2-table-string-cell>`}
    `
  }

  get cell(): any {
    return this.renderRoot?.querySelector(
      this.TAG_MAPPER[this.type || 'string']
    )
  }

  /**
   * @description Set class list for every single cell
   * currently alignment for innsert text of cell is only supported.
   * @param config Object having class list
   */
  _computeClasses(config?: ColumnConfigInterface): string {
    const { align } = config || {}
    let classes: string[] = []
    if (align) classes.push(align)

    return classes.join(' ')
  }
}
