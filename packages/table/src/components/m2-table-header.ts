import './m2-table-cell'
import './m2-table-header-display-cell'

import { ButtonType, CellEvents, Events } from '../enums'
import { CSSResult, PropertyValues, TemplateResult, customElement, html } from 'lit-element'
import { ColumnConfig, IconButtonOptions, RowSelectorOption, TableButton, TextButtonOptions } from '../interfaces'
import { Tooltip, TooltipOptions } from '@m2fw/tooltip'
import { commonStyle, headerStyle } from '../assets/styles'

import { AbstractM2TablePart } from '../abstracts'

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
    `
  }

  private renderRowNumbering(): TemplateResult {
    return html` <th class="header-numbering numbering">No.</th>`
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
      </th>`
    } else if (button.type === ButtonType.Text) {
      const buttonOptions: TextButtonOptions = button.options as TextButtonOptions

      return html` <th>
        <button>${buttonOptions.text}</button>
      </th>`
    }
  }

  private renderTableCell(config: ColumnConfig, columnIdx: number): TemplateResult {
    let batchEditable: boolean = false
    if (typeof config.batchEditable === 'function') {
      batchEditable = config.batchEditable(config)
    } else {
      batchEditable = Boolean(config.batchEditable)
    }

    let tooltipOptions: TooltipOptions | undefined = this.getTooltipOptions(config)

    return html`
      <th
        columnIdx="${columnIdx}"
        style="width: ${config.width || 150}px"
        ?hidden="${config.hidden}"
        @mousemove="${this.onMouseMoveHandler.bind(this)}"
        @mouseleave="${this.onMouseLeaveHandler.bind(this)}"
        @mousedown="${this.onMouseDownHandler.bind(this)}"
      >
        ${config.selectable ? html` <input class="column-selector" type="checkbox" .config="${config}" /> ` : ''}
        <m2-table-header-display-cell .batchEditable="${batchEditable}" .tooltipOptions="${tooltipOptions}">
          ${batchEditable ? html`${this.renderBatchEditor(config, columnIdx)}` : html`${this.displayHeader(config)}`}
        </m2-table-header-display-cell>
      </th>
    `
  }

  renderBatchEditor(column: ColumnConfig, columnIdx: number): TemplateResult {
    let cloned: ColumnConfig = Object.assign({}, column)

    cloned.editable = true
    cloned.displayValue = () =>
      html` <m2-table-header-display-cell> ${this.displayHeader(column)} </m2-table-header-display-cell> `

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

  getTooltipOptions(config: ColumnConfig): TooltipOptions | undefined {
    let tooltipOptions: TooltipOptions | undefined = undefined
    if (config.tooltip) {
      const headerText: string = this.getHeaderText(config)
      tooltipOptions = { subject: headerText, content: config.tooltip }
    }

    return tooltipOptions
  }

  /**
   * @description This is the function to concrete how header looks like.
   * @param config configuration for header
   */
  displayHeader(config: ColumnConfig): TemplateResult {
    const headerText: string = this.getHeaderText(config)
    return html`<span class="header-text">${headerText}</span>`
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

  private onMouseMoveHandler(e: MouseEvent): void {
    const thEl: HTMLTableHeaderCellElement = e.currentTarget as HTMLTableHeaderCellElement
    if (thEl.clientWidth - 10 <= e.offsetX) {
      thEl.setAttribute('resizable', '')
    } else if (thEl.hasAttribute('resizable')) {
      thEl.removeAttribute('resizable')
    }
  }

  private onMouseLeaveHandler(e: MouseEvent): void {
    const thEl: HTMLTableHeaderCellElement = e.currentTarget as HTMLTableHeaderCellElement
    if (thEl.hasAttribute('resizable')) thEl.removeAttribute('resizable')
  }

  private onMouseDownHandler(e: MouseEvent): void {
    const thEl: HTMLTableHeaderCellElement = e.currentTarget as HTMLTableHeaderCellElement
    if (!thEl.hasAttribute('resizable')) return

    e.preventDefault()
    e.stopPropagation()

    const padding: number = this.paddingDiff(thEl)
    const columnWidth: number = thEl.offsetWidth - padding
    const pageX: number = e.pageX

    let columnIdx: number
    let width: number

    const modifyCellWidth = (e: MouseEvent) => {
      columnIdx = Number(thEl.getAttribute('columnIdx'))
      const diffX = e.pageX - pageX

      width = columnWidth + diffX
      if (width <= this.minColumnWidth) width = this.minColumnWidth
      if (width >= this.maxColumnWidth) width = this.maxColumnWidth

      thEl.style.width = `${width}px`
    }

    document.addEventListener('mousemove', modifyCellWidth)
    document.addEventListener('mouseup', () => {
      this.dispatchEvent(new CustomEvent(CellEvents.ColumnWidthChange, { detail: { columnIdx, width } }))
      document.removeEventListener('mousemove', modifyCellWidth)
    })
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
