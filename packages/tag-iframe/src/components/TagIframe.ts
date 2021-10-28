export class TagIframe extends HTMLIFrameElement {
  connectedCallback() {
    if (!this.contentDocument?.body) return
    this.contentDocument.body.innerHTML = this.textContent || ''
    this.textContent = ''
  }

  setContent(content: string): void {
    if (!this.contentDocument?.body) throw new Error('Content document body is not loaded yet')
    this.contentDocument.body.innerHTML = content
  }
}

customElements.define('tag-iframe', TagIframe, { extends: 'iframe' })
