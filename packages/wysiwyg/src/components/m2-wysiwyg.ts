import { CSSResult, LitElement, TemplateResult, css, customElement, html, property } from 'lit-element'

@customElement('m2-wysiwyg')
export class M2Wysiwyg extends LitElement {
  public focusedParagraph: HTMLParagraphElement | null = null

  @property({ type: Number }) focusedRowIndex: number = 0

  static get styles(): CSSResult[] {
    return [
      css`
        :host {
          background-color: var(--m2-wysiwyg-bg-color, white);
          width: var(--m2-wysiwyg-width, 600px);
          height: var(--m2-wysiwyg-height, 400px);
          display: flex;
          flex-direction: column;
        }
        #editor {
          outline: none;
          margin: var(--m2-wysiwyg-editor-margin, 10px);
          border: var(--m2-wysiwyg-editor-border, 1px solid black);
          flex: 1;
        }
        #editor p {
          margin: 0px;
          padding: 5px;
        }
      `,
    ]
  }

  get editor(): HTMLDivElement {
    const editor: HTMLDivElement | null = this.renderRoot.querySelector('#editor')
    if (!editor) throw new Error('Failed to find editor')

    return editor
  }

  get paragraphs(): HTMLParagraphElement[] {
    return Array.from(this.editor.querySelectorAll('p'))
  }

  get lastParagraph(): HTMLParagraphElement {
    return this.rowByIdx(this.rowCount - 1)
  }

  get rowCount(): number {
    return this.paragraphs.length
  }

  async firstUpdated(): Promise<void> {
    await this.updateComplete
    this.editor.focus()
  }

  render(): TemplateResult {
    return html`
      <div id="control-panel"></div>
      <div id="editor" contenteditable="true" @keyup="${this.onKeyupHandler}">
        <p>
          <br />
        </p>
      </div>
      <div id="status">
        <span>Row: ${this.focusedRowIndex + 1}</span>
      </div>
    `
  }

  public rowByIdx(idx: number): HTMLParagraphElement {
    const paragraphs: HTMLParagraphElement[] = Array.from(this.editor.querySelectorAll('p'))
    if (!paragraphs[idx]) throw new Error(`No paragraph found at index ${idx}`)

    return paragraphs[idx]
  }

  private onKeyupHandler(event: KeyboardEvent): void {
    if (event.key === 'Enter' || event.key === 'Delete' || event.key === 'Backspace') {
      console.log('Row Count', this.paragraphs.length)
      this.paragraphs.forEach((p: HTMLParagraphElement, index: number) => {
        p.onclick = () => {
          this.focusedParagraph = p
          this.focusedRowIndex = index
        }
        p.onkeydown = () => {
          this.focusedParagraph = p
          this.focusedRowIndex = index
        }
      })
    }
  }
}
