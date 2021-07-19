import '@material/mwc-icon'

import { CSSResult, LitElement, TemplateResult, css, customElement, html } from 'lit-element'

@customElement('format-modifier')
export class FormatModifier extends LitElement {
  static get styles(): CSSResult[] {
    return [
      css`
        :host {
          display: flex;
        }
        div#container {
          display: flex;
          gap: 10px;
        }
        ul {
          display: flex;
          padding: 0px;
          margin: 0px;
        }
        li {
          display: flex;
          list-style: none;
        }
        button,
        span.input-wrapper {
          padding: var(--m2-wysiwyg-button-padding, 5px);
          background-color: var(--m2-wysiwyg-button-color, #dddddd);
          border: 0px;
          display: flex;
          box-shadow: 1px 4px 0 rgb(0, 0, 0, 0.5);
        }
        button:active {
          box-shadow: 1px 1px 0 rgb(0, 0, 0, 0.5);
          position: relative;
          top: 2px;
        }
        mwc-icon {
          margin: auto;
        }
        .input-wrapper {
          display: flex;
        }
        .input-wrapper * {
          margin: auto;
        }
        input,
        select {
          outline: none;
          background-color: transparent;
          border: none;
        }
      `,
    ]
  }

  render(): TemplateResult {
    return html`
      <div id="container">
        <ul>
          <li>
            <button data-command="bold" @click="${this.executeDefaultCommand}">
              <mwc-icon>format_bold</mwc-icon>
            </button>
          </li>
          <li>
            <button data-command="italic" @click="${this.executeDefaultCommand}">
              <mwc-icon>format_italic</mwc-icon>
            </button>
          </li>
          <li>
            <button data-command="underline" @click="${this.executeDefaultCommand}">
              <mwc-icon>format_underlined</mwc-icon>
            </button>
          </li>
        </ul>

        <ul>
          <li>
            <button data-command="justifyLeft" @click="${this.executeDefaultCommand}">
              <mwc-icon>format_align_left</mwc-icon>
            </button>
          </li>

          <li>
            <button data-command="justifyCenter" @click="${this.executeDefaultCommand}">
              <mwc-icon>format_align_center</mwc-icon>
            </button>
          </li>

          <li>
            <button data-command="justifyRight" @click="${this.executeDefaultCommand}">
              <mwc-icon>format_align_right</mwc-icon>
            </button>
          </li>
        </ul>

        <ul>
          <li>
            <button data-command="insertOrderedList" @click="${this.executeDefaultCommand}">
              <mwc-icon>format_list_numbered</mwc-icon>
            </button>
          </li>

          <li>
            <button data-command="insertUnorderedList" @click="${this.executeDefaultCommand}">
              <mwc-icon>list</mwc-icon>
            </button>
          </li>
        </ul>

        <ul>
          <li>
            <span class="input-wrapper">
              <mwc-icon>format_size</mwc-icon>
              <select @change="${this.changeFontSize}">
                <option value="3">Default</option>
                ${Array(10)
                  .fill('')
                  .map((_: void, idx: number) => html`<option>${(idx + 1) * 5}</option>`)}
              </select>
            </span>
          </li>
        </ul>

        <ul>
          <li>
            <span class="input-wrapper">
              <mwc-icon>format_color_text</mwc-icon>
              <input type="color" @change="${this.changeFontColor}" />
            </span>
          </li>
        </ul>

        <ul>
          <li>
            <button @click="${this.addImage}">
              <mwc-icon>image</mwc-icon>
            </button>
          </li>
        </ul>
      </div>
    `
  }

  private executeDefaultCommand(event: Event): void {
    const button: HTMLButtonElement = event.currentTarget as HTMLButtonElement
    if (button.dataset.command) document.execCommand(button.dataset.command, false)
  }

  private changeFontSize(event: Event): void {
    const fontSize: string = (event.currentTarget as HTMLSelectElement).value
    if (fontSize) document.execCommand('fontSize', false, fontSize)
  }

  private changeFontColor(event: Event): void {
    const fontColor: string = (event.currentTarget as HTMLInputElement).value
    if (fontColor) document.execCommand('foreColor', false, fontColor)
  }

  private addImage(): void {
    let input: HTMLInputElement | null = document.createElement('input')
    input.type = 'file'
    input.accept = 'image/*'

    input.onchange = () => {
      if (input?.files?.length) {
        const file: File = input?.files[0]
        const fr: FileReader = new FileReader()
        fr.onload = () => {
          if (fr.result) document.execCommand('insertImage', false, fr.result as string)
        }
        fr.readAsDataURL(file)
      }
    }

    input.click()
  }
}
