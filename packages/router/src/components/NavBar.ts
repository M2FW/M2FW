import { store } from '@m2fw/redux-manager'
import {
  css,
  CSSResult,
  customElement,
  html,
  LitElement,
  property,
  PropertyValues,
  TemplateResult,
} from 'lit-element'
import { connect } from 'pwa-helpers/connect-mixin'
import { PageInfoInterface } from '../interfaces'
import { navigate } from '../redux/reducers'

@customElement('nav-bar')
export class NavBar extends connect(store)(LitElement) {
  @property({ type: String }) _title: string
  @property({ type: String }) _route: string
  @property({ type: Object }) _currentPageElement: PageInfoInterface
  @property({ type: Array }) _pages: PageInfoInterface[] = []
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
          cusor: inherit;
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
        ${this._pages.map(
          (_page: PageInfoInterface) => html`
            <div
              class="page-item"
              @click="${this._navigateTo}"
              route="${_page.route}"
              ?activated="${_page.activated}"
            >
              ${_page.title}
              ${this.useTooltip
                ? html` <span class="tooltip">${_page.route}</span> `
                : ''}
            </div>
          `
        )}
      </div>
    `
  }

  get navBar(): HTMLDivElement {
    return this.shadowRoot.querySelector('div#nav-bar')
  }

  /**
   * @description Get stored pages from localStorage
   *
   * @returns {PageInfoInterface} pages
   */
  get storedPages(): PageInfoInterface[] {
    return (
      (JSON.parse(
        window.localStorage.getItem(this.historyKey)
      ) as PageInfoInterface[]) || []
    )
  }

  updated(changeProps: PropertyValues): void {
    if (changeProps.has('_currentPageElement')) {
      this._toggleCurrentPage(this._currentPageElement)
    }

    if (changeProps.has('maxItemCount')) {
      this._adjustBlockMaxWidth()
    }
  }

  /**
   * @description Renew _pages property to update UI
   *
   * @param {PageInfoInterface} pageElement
   */
  _toggleCurrentPage(pageElement: PageInfoInterface) {
    if (this.excludes.indexOf(pageElement.route) < 0) {
      this._addPages(pageElement)
    }

    this._pages = this.storedPages.map((page: PageInfoInterface) => {
      return {
        ...page,
        activated: Boolean(page.route === pageElement.route),
      }
    })
  }

  /**
   * @description Add current page to localStorage and slice with maxItemCount
   *
   * @param {PageInfoInterface} pageElement
   */
  _addPages(pageElement: PageInfoInterface): void {
    const pages: PageInfoInterface[] = [
      pageElement,
      ...this.storedPages.filter(
        (storedPage: PageInfoInterface) =>
          storedPage.route !== pageElement.route
      ),
    ].slice(0, this.maxItemCount)

    window.localStorage.setItem(this.historyKey, JSON.stringify(pages))
  }

  /**
   * @description history box click handler
   */
  _navigateTo(e: MouseEvent): void {
    const route: string = (e.currentTarget as HTMLElement).getAttribute('route')
    navigate(route)
    this._currentPageElement = this.storedPages.find(
      (page: PageInfoInterface) => page.route === route
    )
  }

  _adjustBlockMaxWidth(): void {
    this.navBar.style.setProperty(
      'grid-template-columns',
      `repeat(${this.maxItemCount}, 1fr)`
    )
  }

  stateChanged(state: any): void {
    if (typeof state?.route?.route !== 'undefined') {
      this._currentPageElement = {
        title: state.route.title,
        route: state.route.route,
      }
    }
  }
}
