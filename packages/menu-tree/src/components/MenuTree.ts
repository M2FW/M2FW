import './MenuTreeGroup'
import './MenuTreeItem'

import { AccessKeyMapperInterface, MenuItemInterface } from '../interfaces'
import {
  LitElement,
  PropertyValues,
  TemplateResult,
  customElement,
  html,
  property,
} from 'lit-element'

import { connect } from 'pwa-helpers/connect-mixin'
import { setMenus } from '../redux/reducers'
import { store } from '@m2fw/redux-manager'

@customElement('menu-tree')
export class MenuTree extends connect(store)(LitElement) {
  @property() provider: string | Function
  @property({ type: Function }) router: Function
  @property({ type: Object }) accessKeyMapper: AccessKeyMapperInterface = {
    text: 'name',
    routing: 'routing',
    subMenus: 'menus',
  }
  @property({ type: Array }) menus: MenuItemInterface[] = []

  render(): TemplateResult {
    return html`
      ${this.menus.map(
      (menu: MenuItemInterface): TemplateResult => html`
          ${menu[this.accessKeyMapper.subMenus]?.length
          ? html`<menu-tree-group
                .text="${menu[this.accessKeyMapper.text]}"
                .subMenus="${menu[this.accessKeyMapper.subMenus]}"
                .accessKeyMapper="${this.accessKeyMapper}"
                .router="${this.router}"
              ></menu-tree-group>`
          : html`<menu-tree-item
                .menu="${menu}"
                .text="${menu[this.accessKeyMapper.text]}"
                .routing="${menu[this.accessKeyMapper.routing]}"
                .router="${this.router}"
              ></menu-tree-item>`}
        `
    )}
    `
  }

  updated(changedProps: PropertyValues) {
    if (changedProps.has('provider')) {
      this._fetchMenus(this.provider)
    }
  }

  async _fetchMenus(provider: string | Function): Promise<void> {
    let menus: MenuItemInterface[]
    try {
      if (provider instanceof Function) {
        menus = await provider()
      } else {
        const res: Response = await fetch(provider)
        menus = await res.json()
      }

      setMenus(store, menus)
      this.menus = menus
    } catch (e) {
      throw new Error(e)
    }
  }
}
