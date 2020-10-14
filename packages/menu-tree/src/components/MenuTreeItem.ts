import {
  CSSResult,
  LitElement,
  TemplateResult,
  css,
  customElement,
  html,
  property,
} from 'lit-element'

import { MenuItemInterface } from '../interfaces'
import { connect } from 'pwa-helpers/connect-mixin'
import { setCurrentMenu } from '../redux/reducers'
import { store } from '@m2fw/redux-manager'

@customElement('menu-tree-item')
export class MenuTreeItem extends connect(store)(LitElement) {
  @property({ type: Object }) menu: MenuItemInterface
  @property({ type: String }) text: string
  @property({ type: String }) routing: string
  @property({ type: Function }) router: Function

  static get styles(): CSSResult {
    return css`
      :host {
        background-color: lightgreen;
      }
    `
  }

  render(): TemplateResult {
    return html`
      <li
        .routing="${this.routing}"
        @click="${(e: MouseEvent): void => {
        e.stopPropagation()
        setCurrentMenu(store, this.menu)
        this.router(this.menu)
      }}"
      >
        ${this.text}
      </li>
    `
  }
}
