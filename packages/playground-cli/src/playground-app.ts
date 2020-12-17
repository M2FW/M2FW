import './pages'

import { LitElement, customElement, html, property } from 'lit-element'

import { layoutStyle } from './assets/styles/app-styles'

@customElement('playground-app')
export class PlaygroundApp extends LitElement {
  @property({ type: String }) appName: string = 'Playground'

  static get styles() {
    return [layoutStyle]
  }

  render() {
    return html`
      <header>
        <h1>${this.appName}</h1>
      </header>
      <nav></nav>
      <main>
        <sample-page></sample-page>
      </main>
      <aside></aside>
      <footer></footer>
    `
  }
}
