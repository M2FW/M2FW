export class TagIframe extends HTMLIFrameElement {
  constructor() {
    super()
    this.addEventListener('load', this.onLoadHandler)
  }

  onLoadHandler(): void {
    if (!this.contentDocument?.body) return
    this.contentDocument.body.innerHTML = this.textContent || ''
    this.textContent = ''
  }
}

customElements.define('tag-iframe', TagIframe, { extends: 'iframe' })
