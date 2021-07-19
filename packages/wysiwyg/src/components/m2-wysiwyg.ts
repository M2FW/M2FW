import '@material/mwc-icon'
import './modifiers/format-modifier'

import { CSSResult, LitElement, TemplateResult, css, customElement, html, property } from 'lit-element'

export type CommandIconMapType = {
  command: string
  icon: string
}
@customElement('m2-wysiwyg')
export class M2Wysiwyg extends LitElement {
  public focusedParagraph: HTMLParagraphElement | null = null

  @property({ type: Number }) focusedRowIndex: number = 0

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
          margin: var(--m2-wysiwyg-editor-margin, 10px);
        }
        #editor {
          outline: none;
          margin: var(--m2-wysiwyg-editor-margin, 10px);
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
    const editor: HTMLDivElement | null = this.renderRoot.querySelector('#editor')
    if (!editor) throw new Error('Failed to find editor')

    return editor
  }

  async firstUpdated(): Promise<void> {
    await this.updateComplete
    this.editor.focus()
  }

  render(): TemplateResult {
    return html`
      <div id="control-panel">
        <format-modifier></format-modifier>
        <justify-modifier></justify-modifier>
        <size-modifier></size-modifier>
        <etc-modifier></etc-modifier>
      </div>
      <div id="editor" contenteditable="true">
        <p>
          <br />
        </p>
      </div>
    `
  }

  getText(): string {
    return this.editor.innerHTML
  }
}
