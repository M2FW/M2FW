import './m2-wysiwyg-controller'

import { CSSResult, LitElement, PropertyValues, TemplateResult, css, customElement, html, property } from 'lit-element'

import { ERRORS } from '../constants'
import { M2WysiwygController } from './m2-wysiwyg-controller'

export type CommandIconMapType = {
  command: string
  icon: string
}
@customElement('m2-wysiwyg')
export class M2Wysiwyg extends LitElement {
  @property({ type: String }) content: string = ''
  @property({ type: Number }) textLength: number = 0
  @property({ type: Number }) textLimit: number = 200
  @property({ type: Boolean }) imageUploadable: boolean = false
  @property({ type: Boolean }) editable: boolean = true

  static get styles(): CSSResult[] {
    return [
      css`
        :host {
          background-color: var(--m2-wysiwyg-bg-color, white);
          display: flex;
          flex: 1;
          flex-direction: column;
          overflow: hidden;
        }
        #control-panel {
          background-color: var(--m2-wysiwyg-control-panel-bg-color, #dddddd);
        }
        #editor {
          outline: none;
          padding: var(--m2-wysiwyg-editor-padding, 10px);
          border-top: var(
            --m2-wysiwyg-editor-border-top,
            1px var(--m2-wysiwyg-editor-border-style, solid) var(--m2-wysiwyg-editor-border-color, gray)
          );
          border-bottom: var(
            --m2-wysiwyg-editor-border-bottom,
            1px var(--m2-wysiwyg-editor-border-style, solid) var(--m2-wysiwyg-editor-border-color, gray)
          );
          border-left: var(
            --m2-wysiwyg-editor-border-left,
            0px var(--m2-wysiwyg-editor-border-style, solid) var(--m2-wysiwyg-editor-border-color, gray)
          );
          border-right: var(
            --m2-wysiwyg-editor-border-right,
            0px var(--m2-wysiwyg-editor-border-style, solid) var(--m2-wysiwyg-editor-border-color, gray)
          );
          flex: 1;
          overflow: auto;
        }
        #editor p {
          margin: 0px;
          padding: 0px;
        }
        #status-bar {
          display: flex;
          background-color: var(--m2-wysiwyg-status-bar-bg-color, var(--m2-wysiwyg-control-panel-bg-color, #dddddd));
          height: var(--m2-wysiwyg-status-bar-height, 30px);
          gap: 10px;
          padding: var(--m2-wysiwyg-status-bar-padding, 5px);
        }
        #status-bar > * {
          margin: auto 0px;
          font-size: var(--m2-wysiwyg-status-bar-font-size, 12px);
        }
        #status-bar > *:first-child {
          margin-left: auto;
        }
      `,
    ]
  }

  get editor(): HTMLDivElement {
    const editor: HTMLDivElement | null = this.renderRoot.querySelector<HTMLDivElement>('#editor')
    if (!editor) throw new Error('Failed to find editor')

    return editor
  }

  get controller(): M2WysiwygController {
    const controller: M2WysiwygController | null =
      this.renderRoot.querySelector<M2WysiwygController>('m2-wysiwyg-controller')
    if (!controller) throw new Error('Failed to find controller')

    return controller
  }

  async firstUpdated(): Promise<void> {
    await this.updateComplete
    this.editor.focus()
    this.controller.editor = this.editor
  }

  updated(changedProps: PropertyValues): void {
    if (changedProps.has('content')) this.setContent(this.content)
  }

  render(): TemplateResult {
    return html`
      ${this.editable
        ? html`
            <div id="control-panel">
              <m2-wysiwyg-controller
                @optionChanged="${this.focusOnEditor}"
                .imageUploadable="${this.imageUploadable}"
              ></m2-wysiwyg-controller>
            </div>
          `
        : ''}

      <div id="editor" contenteditable="${this.editable}" @input="${this.onInputHandler}">
        <p><br /></p>
      </div>

      <div id="status-bar">
        <span>${this.textLength}/${this.textLimit}</span>
      </div>
    `
  }

  public getText(): string {
    if (this.textLength > this.textLimit) throw new Error(ERRORS.EXCEED_LIMITATION)
    return this.editor.innerHTML
  }

  public setContent(text: string): void {
    this.editor.innerHTML = text
    this.textLength = this.editor.textContent?.length || this.textLength
  }

  public focusOnEditor(): void {
    this.editor.focus()
  }

  private onInputHandler(): void {
    this.textLength = this.editor.textContent?.length || this.textLength
  }
}
