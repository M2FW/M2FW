import { CSSResult, customElement, html, TemplateResult } from 'lit-element'
import { AbstractM2TablePart } from '../abstracts'
import { headerStyle } from '../assets/styles'
import { ButtonType, Events } from '../enums'
import {
  ColumnConfigInterface,
  IconButtonOptionsInterface,
  TableButtonInterface,
  TextButtonOptionsInterface,
} from '../interfaces'

@customElement('m2-table-header')
export class M2TableHeader extends AbstractM2TablePart {
  static get styles(): CSSResult[] {
    return [headerStyle]
  }

  render(): TemplateResult {
    return html`
      <thead>
        <tr>
          ${this.numbering ? this._renderRowNumbering() : ''}
          ${this.selectable ? this._renderSelectInput() : ''}
          ${this.buttons.map((button: TableButtonInterface) =>
            this._renderButton(button)
          )}
          ${this.columns.map((column: ColumnConfigInterface) =>
            this._renderTableCell(column)
          )}
        </tr>
      </thead>
    `
  }

  _renderRowNumbering(): TemplateResult {
    return html` <th width="15px"></th> `
  }

  _renderButton(button: TableButtonInterface): TemplateResult | void {
    if (button.type === ButtonType.Icon) {
      let icon: any
      const buttonOptions: IconButtonOptionsInterface = button.options as IconButtonOptionsInterface
      if (typeof buttonOptions.icon === 'function') {
        icon = icon as HTMLElement
        icon = buttonOptions.icon.call(this)
      } else {
        icon = new Image()
        icon.src = buttonOptions.icon
      }

      return html`<th>
        <button>
          ${icon}
        </button>
      </th>`
    } else if (button.type === ButtonType.Text) {
      const buttonOptions: TextButtonOptionsInterface = button.options as TextButtonOptionsInterface

      return html` <th>
        <button>
          ${buttonOptions.text}
        </button>
      </th>`
    }
  }

  _renderSelectInput(): TemplateResult {
    return html`
      <th>
        <input
          id="select-all"
          type="checkbox"
          @change="${this.onSelecterAllChangeHandler.bind(this)}"
        />
      </th>
    `
  }

  _renderTableCell(column: ColumnConfigInterface): TemplateResult {
    return html`
      <th width="${column.width || 150}" ?hidden="${column.hidden}">
        ${this.displayHeader(column)}
      </th>
    `
  }

  /**
   * @description This is the function to concrete how header looks like.
   * @param config configuration for header
   */
  displayHeader(config: ColumnConfigInterface): string {
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
   * It will distach custom event (select-all, deselect-all) based on the value of current checkbox.
   * @param e
   */
  onSelecterAllChangeHandler(e: InputEvent): void {
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
}
