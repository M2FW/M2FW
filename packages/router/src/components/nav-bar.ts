import {
  CSSResult,
  LitElement,
  PropertyValues,
  TemplateResult,
  css,
  customElement,
  html,
  property,
} from 'lit-element'

import { PageInfo } from '../interfaces'
import { connect } from 'pwa-helpers/connect-mixin'
import { navigate } from '../redux/actions'
import { store } from '@m2fw/redux-manager'

@customElement('nav-bar')
export class NavBar extends connect(store)(LitElement) {
  @property({ type: String }) title: string = ''
  @property({ type: String }) route: string = ''
  @property({ type: Object }) currentPageElement?: PageInfo
  @property({ type: Array }) pages: PageInfo[] = []
  @property({ type: Boolean }) useTooltip: boolean = true
  @property({ type: Boolean }) storeHistory: boolean = true
  @property({ type: String }) historyKey: string = '__m2fw__nav_histories__'
  @property({ type: Number }) maxItemCount: number = 10
  @property({ type: Array }) excludes: string[] = []

  static get styles(): CSSResult[] {
    return [
      css`
        :host {
          display: block;
        }
        #nav-bar {
          display: grid;
          grid-template-columns: repeat(10, 1fr);
          background-color: var(--nav-bar-background-color, inherit);
        }
        #nav-bar > .page-item {
          flex: 1;
          margin: var(--nav-bar-page-item-margin, auto 0);
          cursor: var(--nav-bar-page-item-cursor, pointer);
          font-size: var(--nav-bar-page-item-font-size, 10pt);
          font-weight: var(--nav-bar-page-item-font-weight, none);
          font-style: var(--nav-bar-page-item-font-style, none);
          text-align: var(--nav-bar-page-item-text-align, center);
          color: var(--nav-bar-page-item-color, darkblue);
          background-color: var(
            --nav-bar-page-item-background-color,
            lightblue
          );
          border: var(--nav-bar-page-item-border, 1px solid darkblue);
          border-radius: var(--nav-bar-page-item-border-radius, 10px 10px 0 0);
          padding: var(--nav-bar-page-item-padding, 5px);
        }
        #nav-bar > .page-item[activated] {
          font-size: var(--nav-bar-page-item-activated-font-size, 10pt);
          font-weight: var(--nav-bar-page-item-activated-font-weight, bold);
          font-style: var(--nav-bar-page-item-activated-font-style, italic);
          text-align: var(--nav-bar-page-item-activated-text-align, center);
          color: var(--nav-bar-page-item-activated-color, white);
          background-color: var(
            --nav-bar-page-item-activated-background-color,
            darkblue
          );
          border: var(--nav-bar-page-item-activated-border, 1px solid darkblue);
          border-radius: var(
            --nav-bar-page-item-activated-border-radius,
            10px 10px 0 0
          );
          padding: var(--nav-bar-page-item-activated-padding, 5px);
        }
        #nav-bar > .page-item > .tooltip {
          cursor: inherit;
          visibility: hidden;
          position: absolute;
          font-size: var(--nav-bar-tooltip-font-size, 10pt);
          color: var(--nav-bar-tooltip-color, white);
          background-color: var(--nav-bar-tooltip-background-color, black);
          border-radius: var(--nav-bar-tooltip-border-radius, 10px);
          padding: var(--nav-bar-tooltip-padding, 5px);
        }
        #nav-bar > .page-item:hover > .tooltip {
          visibility: visible;
        }
      `,
    ]
  }

  render(): TemplateResult {
    return html`
      <div id="nav-bar">
        ${this.pages.map(
          (page: PageInfo) => html`
            <div
              class="page-item"
              @click="${this.navigateTo}"
              route="${page.route}"
              ?activated="${page.activated}"
            >
              ${page.title}
              ${this.useTooltip
                ? html` <span class="tooltip">${page.route}</span> `
                : ''}
            </div>
          `
        )}
      </div>
    `
  }

  get navBar(): HTMLDivElement | null {
    return this.renderRoot?.querySelector('div#nav-bar')
  }

  /**
   * @description Get stored pages from localStorage
   *
   * @returns {PageInfo} pages
   */
  get storedPages(): PageInfo[] {
    const storedPages: string | null = window.localStorage.getItem(
      this.historyKey
    )
    if (storedPages) {
      return JSON.parse(storedPages)
    } else {
      return []
    }
  }

  updated(changeProps: PropertyValues): void {
    if (changeProps.has('currentPageElement') && this.currentPageElement) {
      this.toggleCurrentPage(this.currentPageElement)
    }

    if (changeProps.has('maxItemCount')) {
      this._adjustBlockMaxWidth()
    }
  }

  /**
   * @description Renew _pages property to update UI
   *
   * @param {PageInfo} pageElement
   */
  private toggleCurrentPage(pageElement: PageInfo) {
    if (this.excludes.indexOf(pageElement.route) < 0) {
      this.addPages(pageElement)
    }

    this.pages = this.storedPages.map((page: PageInfo) => {
      return {
        ...page,
        activated: Boolean(page.route === pageElement.route),
      }
    })
  }

  /**
   * @description Add current page to localStorage and slice with maxItemCount
   *
   * @param {PageInfo} pageElement
   */
  addPages(pageElement: PageInfo): void {
    const pages: PageInfo[] = [
      pageElement,
      ...this.storedPages.filter(
        (storedPage: PageInfo) => storedPage.route !== pageElement.route
      ),
    ].slice(0, this.maxItemCount)

    window.localStorage.setItem(this.historyKey, JSON.stringify(pages))
  }

  /**
   * @description history box click handler
   */
  navigateTo(e: MouseEvent): void {
    const route: string | null = (e.currentTarget as HTMLElement).getAttribute(
      'route'
    )
    if (route) {
      navigate(route)
      this.currentPageElement = this.storedPages.find(
        (page: PageInfo) => page.route === route
      )
    }
  }

  _adjustBlockMaxWidth(): void {
    this.navBar?.style.setProperty(
      'grid-template-columns',
      `repeat(${this.maxItemCount}, 1fr)`
    )
  }

  stateChanged(state: any): void {
    if (typeof state?.route?.route !== 'undefined') {
      this.currentPageElement = {
        title: state.route.title,
        route: state.route.route,
      }
    }
  }
}
