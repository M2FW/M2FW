import './m2-table-cell'
import '@material/mwc-icon'

import { ButtonType, CellEvents, Events } from '../enums'
import { CSSResult, PropertyValues, TemplateResult, customElement, html } from 'lit-element'
import { ColumnConfig, IconButtonOptions, RowSelectorOption, TableButton, TextButtonOptions } from '../interfaces'
import { commonStyle, headerStyle } from '../assets/styles'

import { AbstractM2TablePart } from '../abstracts'
import { Tooltip } from '@m2fw/tooltip'

@customElement('m2-table-header')
export class M2TableHeader extends AbstractM2TablePart {
  _lastAccVal?: number

  static get styles(): CSSResult[] {
    return [commonStyle, headerStyle]
  }

  render(): TemplateResult {
    return html`
      <thead>
        <tr>
          ${this.selectable ? this.renderSelectInput() : ''} ${this.numbering ? this.renderRowNumbering() : ''}
          ${this.buttons.map((button: TableButton) => this.renderButton(button))}
          ${this.columns.map((column: ColumnConfig, columnIdx: number) => this.renderTableCell(column, columnIdx))}
        </tr>
      </thead>
    `
  }

  updated(changedProps: PropertyValues): void {
    if (changedProps.has('columns') && this.columns?.length) {
      this.setStickyColumnStyle()
    }
  }

  private renderSelectInput(): TemplateResult {
    const { exclusive, handySelector = true }: RowSelectorOption = this.selectable

    return html`
      <th class="header-selector selector">
        ${exclusive
          ? ''
          : html`
              <input
                id="select-all"
                type="checkbox"
                ?disabled="${!handySelector}"
                @change="${this.onSelectorAllChangeHandler.bind(this)}"
              />
            `}
      </th>
      <div class="splitter non-resizable"></div>
    `
  }

  private renderRowNumbering(): TemplateResult {
    return html` <th class="header-numbering numbering">No.</th>
      <div class="splitter non-resizable"></div>`
  }

  private renderButton(button: TableButton): TemplateResult | void {
    if (button.type === ButtonType.Icon) {
      let icon: any
      const buttonOptions: IconButtonOptions = button.options as IconButtonOptions
      if (typeof buttonOptions.icon === 'function') {
        icon = icon as HTMLElement
        icon = buttonOptions.icon.call(this)
      } else {
        icon = new Image()
        icon.src = buttonOptions.icon
      }

      return html`<th>
          <button disabled></button>
        </th>
        <div class="splitter non-resizable"></div>`
    } else if (button.type === ButtonType.Text) {
      const buttonOptions: TextButtonOptions = button.options as TextButtonOptions

      return html` <th>
          <button>${buttonOptions.text}</button>
        </th>
        <div class="splitter non-resizable"></div>`
    }
  }

  private renderTableCell(column: ColumnConfig, columnIdx: number): TemplateResult {
    return html`
      <th columnIdx="${columnIdx}" style="width: ${column.width || 150}px" ?hidden="${column.hidden}">
        ${typeof column.bulkEditable === 'function'
          ? html`
              ${column.bulkEditable(column) ? this.renderBulkEditor(column, columnIdx) : this.displayHeader(column)}
            `
          : column.bulkEditable
          ? this.renderBulkEditor(column, columnIdx)
          : this.displayHeader(column)}
        ${column.tooltip
          ? html`<mwc-icon
              class="tooltip-icon"
              @click="${(e: MouseEvent) => this.showToolTip(e, this.getHeaderText(column), column.tooltip as string)}"
              >help</mwc-icon
            >`
          : ''}
      </th>

      ${column.hidden ? '' : html`<div class="splitter" @mousedown="${this.onMouseDownHandler.bind(this)}"></div>`}
    `
  }

  renderBulkEditor(column: ColumnConfig, columnIdx: number): TemplateResult {
    let cloned: ColumnConfig = Object.assign({}, column)

    cloned.editable = true
    cloned.displayValue = () =>
      html`${this.getHeaderText(column)} ${html`<mwc-icon class="header-edit-icon">edit</mwc-icon>`}`

    return html`<m2-table-cell
      @valueChange="${this.dispatchHeaderCellValueChangeEvent.bind(this)}"
      .columnIdx="${columnIdx}"
      .config="${cloned}"
      .type="${column.type}"
    ></m2-table-cell>`
  }

  getHeaderText(config: ColumnConfig): string {
    if (config.header) {
      if (typeof config.header === 'function') {
        return config.header()
      } else {
        return config.header
      }
    } else {
      return config.name
    }
  }

  /**
   * @description This is the function to concrete how header looks like.
   * @param config configuration for header
   */
  displayHeader(config: ColumnConfig): TemplateResult {
    const headerText: string = this.getHeaderText(config)
    return html`<span>${headerText}</span>`
  }

  /**
   * @description Change event handler of select-all check box.
   * It will dispatch custom event (select-all, deselect-all) based on the value of current checkbox.
   * @param e
   */
  onSelectorAllChangeHandler(e: InputEvent): void {
    const checked: boolean = (e.currentTarget as HTMLInputElement).checked
    if (checked) {
      this.dispatchEvent(
        new CustomEvent(Events.SelectorSelectAll, {
          bubbles: true,
          composed: true,
          cancelable: true,
        })
      )
    } else {
      this.dispatchEvent(
        new CustomEvent(Events.SelectorDeselectAll, {
          bubbles: true,
          composed: true,
          cancelable: true,
        })
      )
    }
  }

  private onMouseDownHandler(e: MouseEvent): void {
    e.preventDefault()
    e.stopPropagation()

    this.removeStickyStyles()
    const splitter: HTMLDivElement = e.currentTarget as HTMLDivElement
    const cell: HTMLTableHeaderCellElement = splitter.previousElementSibling as HTMLTableHeaderCellElement

    const padding: number = this.paddingDiff(cell)
    const columnWidth: number = cell.offsetWidth - padding
    const pageX: number = e.pageX

    let columnIdx: number
    let width: number

    const modifyCellWidth = (e: MouseEvent) => {
      columnIdx = Number(cell.getAttribute('columnIdx'))
      const diffX = e.pageX - pageX

      width = columnWidth + diffX
      if (width <= this.minColumnWidth) width = this.minColumnWidth
      if (width >= this.maxColumnWidth) width = this.maxColumnWidth

      cell.style.width = `${width}px`
    }

    document.addEventListener('mousemove', modifyCellWidth)
    document.addEventListener('mouseup', () => {
      this.dispatchEvent(new CustomEvent(CellEvents.ColumnWidthChange, { detail: { columnIdx, width } }))
      document.removeEventListener('mousemove', modifyCellWidth)
    })
  }

  private removeStickyStyles(): void {
    Array.from(this.renderRoot.querySelectorAll('[sticky]')).forEach((element: Element) =>
      element.removeAttribute('sticky')
    )
  }

  paddingDiff(cell: HTMLTableHeaderCellElement): number {
    const padLeft: number = parseInt(window.getComputedStyle(cell, null).getPropertyValue('padding-left'))
    const padRight: number = parseInt(window.getComputedStyle(cell, null).getPropertyValue('padding-right'))
    return padLeft + padRight
  }

  private dispatchHeaderCellValueChangeEvent(event: CustomEvent): void {
    event.stopPropagation()
    this.dispatchEvent(
      new CustomEvent(CellEvents.HeaderCellValueChange, {
        detail: event.detail,
      })
    )
  }

  private showToolTip(event: MouseEvent, subject: string, content: string): void {
    Tooltip.show(event.clientX, event.clientY, { subject, content })
  }
}
