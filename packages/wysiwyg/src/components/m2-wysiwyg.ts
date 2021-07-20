import './m2-wysiwyg-controller'

import { CSSResult, LitElement, TemplateResult, css, customElement, html, property } from 'lit-element'

import { M2WysiwygController } from './m2-wysiwyg-controller'

export type CommandIconMapType = {
  command: string
  icon: string
}
@customElement('m2-wysiwyg')
export class M2Wysiwyg extends LitElement {
  public focusedParagraph: HTMLParagraphElement | null = null

  @property({ type: String }) content: string = ''

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

  render(): TemplateResult {
    return html`
      <div id="control-panel">
        <m2-wysiwyg-controller @optionChanged="${this.focusOnEditor}"></m2-wysiwyg-controller>
      </div>
      <div id="editor" contenteditable="true">
        <p>${this.content ? this.content : html`<br />`}</p>
      </div>
    `
  }

  public getText(): string {
    return this.editor.innerHTML
  }

  public focusOnEditor(): void {
    this.editor.focus()
  }
}
