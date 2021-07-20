import { CSSResult, LitElement, TemplateResult, css, customElement, html } from 'lit-element'

import { M2Wysiwyg } from './m2-wysiwyg'
import { property } from 'lit-element'

@customElement('m2-wysiwyg-controller')
export class M2WysiwygController extends LitElement {
  @property({ type: Object }) editor?: HTMLDivElement
  @property({ type: Boolean }) editLinkURL: boolean = false

  static get styles(): CSSResult[] {
    return [
      css`
        :host {
          display: flex;
        }
        div#container {
          display: flex;
          flex-direction: column;
        }
        div#icon-container {
          display: flex;
        }
        ul {
          display: flex;
          padding: 0px;
          margin: var(--m2-wysiwyg-ul-margin, 5px 0px);
          border-right: var(--m2-wysiwyg-ul-boundary, 1px solid #999999);
        }
        li {
          display: flex;
          list-style: none;
        }
        button {
          width: var(--m2-wysiwyg-button-width, calc(30px + var(--m2-wysiwyg-button-padding, 0px)));
          height: var(
            --m2-wysiwyg-button-height,
            var(--m2-wysiwyg-button-width, calc(30px + var(--m2-wysiwyg-button-padding, 0px)))
          );
        }
        button,
        span.input-wrapper {
          padding: var(--m2-wysiwyg-button-padding, 0px);
          background-color: var(--m2-wysiwyg-button-color, transparent);
          border: 1px solid transparent;
          border-radius: var(--m2-wysiwyg-button-border-radius, 5px);

          display: flex;
        }
        button:active {
          color: var(--m2-wysiwyg-button-active-color, white);
        }
        mwc-icon {
          margin: auto;
        }
        .input-wrapper {
          display: flex;
          margin: auto 5px;
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
        input[type='color'] {
          opacity: 0;
          border: none;
          width: 0px;
          height: 0px;
          margin: 0px;
          padding: 0px;
        }
        mwc-icon {
          font-size: var(--m2-wysiwyg-icon-size, medium);
        }
        mwc-icon#font-color-icon {
          color: var(--m2-wysiwyg-font-icon-color, black);
        }
        input#url-input {
          background-color: var(--m2-wysiwyg-url-input-bg-color, white);
          padding: 5px;
          margin: 5px;
          border-radius: 5px;
        }
      `,
    ]
  }

  render(): TemplateResult {
    return html`
      <div id="container">
        <div id="icon-container">
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
                  <option value="3">3</option>
                  ${Array(10)
                    .fill('')
                    .map((_: void, idx: number) => html`<option>${(idx + 1) * 5}</option>`)}
                </select>
              </span>
            </li>

            <li>
              <button @click="${this.openColorPicker}">
                <mwc-icon id="font-color-icon">format_color_text</mwc-icon>
              </button>

              <input type="color" @change="${this.changeFontColor}" />
            </li>
          </ul>

          <ul>
            <li>
              <button @click="${this.addImage}">
                <mwc-icon>image</mwc-icon>
              </button>
            </li>

            <li>
              <button @click="${this.openLinkInput}">
                <mwc-icon>link</mwc-icon>
              </button>
            </li>
          </ul>
        </div>

        ${this.editLinkURL ? html` <input id="url-input" type="url" value="https://" /> ` : ''}
      </div>
    `
  }

  private executeDefaultCommand(event: Event): void {
    const button: HTMLButtonElement = event.currentTarget as HTMLButtonElement
    if (button.dataset.command) document.execCommand(button.dataset.command, false)

    this.dispatchOptionChanged()
  }

  private changeFontSize(event: Event): void {
    const fontSize: string = (event.currentTarget as HTMLSelectElement).value
    if (fontSize) document.execCommand('fontSize', false, fontSize)

    this.dispatchOptionChanged()
  }

  private openColorPicker(): void {
    const colorPicker: HTMLInputElement | null = this.renderRoot.querySelector<HTMLInputElement>('input[type=color]')
    if (colorPicker) colorPicker.click()
  }

  private changeFontColor(event: Event): void {
    const fontColor: string = (event.currentTarget as HTMLInputElement).value
    this.style.setProperty('--m2-wysiwyg-font-icon-color', fontColor)
    if (fontColor) document.execCommand('foreColor', false, fontColor)

    this.dispatchOptionChanged()
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

          this.dispatchOptionChanged()
        }
        fr.readAsDataURL(file)
      }
    }

    input.click()
  }

  private async openLinkInput(): Promise<void> {
    this.editLinkURL = true
    await this.updateComplete

    const urlInput: HTMLInputElement | null = this.renderRoot.querySelector<HTMLInputElement>('input#url-input')
    if (!urlInput) throw new Error('Failed to find url input')

    urlInput.select()
    urlInput.onchange = () => {
      if (!urlInput.checkValidity()) throw new Error('Invalid URL type')
      const url: string = urlInput.value

      if (!this.editor) return

      this.editor.focus()
      document.execCommand('createLink', false, url)
      this.dispatchEvent(new CustomEvent('optionChanged'))
    }
    urlInput.onblur = () => {
      this.editLinkURL = false
    }
  }

  private dispatchOptionChanged(): void {
    this.dispatchEvent(new CustomEvent('optionChanged'))
  }
}
