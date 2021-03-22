import { ButtonType, CellEvents, Events } from '../enums'
import { CSSResult, TemplateResult, customElement, html, property } from 'lit-element'
import { ColumnConfig, IconButtonOptions, RowSelectorOption, TableButton, TextButtonOptions } from '../interfaces'
import { commonStyle, headerStyle } from '../assets/styles'

import { AbstractM2TablePart } from '../abstracts'

@customElement('m2-table-header')
export class M2TableHeader extends AbstractM2TablePart {
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

  private renderRowNumbering(): TemplateResult {
    return html` <th class="header-numbering numbering">No.</th> `
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
        <button>${icon}</button>
      </th>`
    } else if (button.type === ButtonType.Text) {
      const buttonOptions: TextButtonOptions = button.options as TextButtonOptions

      return html` <th>
        <button>${buttonOptions.text}</button>
      </th>`
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

  private renderTableCell(column: ColumnConfig, columnIdx: number): TemplateResult {
    return html`
      <th
        columnIdx="${columnIdx}"
        style="width: ${column.width || 150}px"
        ?hidden="${column.hidden}"
        @mousemove="${this.onMouseMoveHandler.bind(this)}"
        @mousedown="${this.onMouseDownHandler.bind(this)}"
      >
        ${this.displayHeader(column)}
      </th>
    `
  }

  /**
   * @description This is the function to concrete how header looks like.
   * @param config configuration for header
   */
  displayHeader(config: ColumnConfig): string {
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
    const boundary: number = 3
    const cell: HTMLTableHeaderCellElement = e.currentTarget as HTMLTableHeaderCellElement

    const cellWidth: number = cell.clientWidth
    const offsetX: number = e.offsetX

    if (offsetX >= cellWidth - boundary) {
      cell.classList.add('resizable')
    } else {
      cell.classList.remove('resizable')
    }
  }

  private onMouseDownHandler(e: MouseEvent): void {
    const cell: HTMLTableHeaderCellElement = e.currentTarget as HTMLTableHeaderCellElement
    if (cell.classList.contains('resizable')) {
      const modifyCellWidth = (e: MouseEvent) => {
        const cellWidth: number = Number(cell.style.width.replace('px', ''))
        const width: number = cellWidth + e.movementX
        cell.style.width = width + 'px'
        const columnIdx: number = Number(cell.getAttribute('columnIdx'))

        this.dispatchEvent(new CustomEvent(CellEvents.ColumnWidthChange, { detail: { columnIdx, width } }))
      }

      document.addEventListener('mousemove', modifyCellWidth)
      document.addEventListener('mouseup', () => {
        cell.classList.remove('resizable')
        document.removeEventListener('mousemove', modifyCellWidth)
      })
    }
  }
}
