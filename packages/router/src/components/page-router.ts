import { CSSResult, LitElement, PropertyValues, TemplateResult, css, customElement, html, property } from 'lit-element'
import { navigate, switchToImported } from '../redux/actions'

import { PageDetail } from '../interfaces'
import { connect } from 'pwa-helpers/connect-mixin'
import { store } from '@m2-modules/redux-manager'

@customElement('page-router')
export class PageRouter extends connect(store)(LitElement) {
  @property({ type: Boolean }) __history_back_flag__ = false
  @property({ type: Array }) pages: PageDetail[] = []
  @property({ type: String }) title: string = ''
  @property({ type: String }) route: string = ''
  @property({ type: Boolean }) useHash: boolean = false
  @property({ type: String }) contextPath?: string
  @property({ type: Object }) onRouteChanged: (e: CustomEventInit) => Promise<void> = async (
    e: CustomEventInit
  ): Promise<void> => {
    await this.importElement(e.detail.new.value)
    this.hidePage(e.detail.old.value)
    this.updateRoute(this.title, e.detail.new.value)
    this.showPage(e.detail.new.value)
  }

  static get styles(): CSSResult[] {
    return [
      css`
        :host {
          flex: 1;
          display: flex;
          flex-direction: column;
          overflow: hidden;
        }
        :host > content {
          flex: 1;
          display: flex;
          flex-direction: column;
          overflow: hidden;
        }
        :host > *::slotted(*) {
          display: none;
        }
        :host > *::slotted(*[show]) {
          display: var(--m2-page-router-content-display, inherit);
        }
      `,
    ]
  }

  render(): TemplateResult {
    return html` <slot></slot> `
  }

  constructor() {
    super()
    this.addEventListener('routeChanged', this.onRouteChanged.bind(this))
  }

  get pageSlot(): HTMLSlotElement | void {
    const slot: HTMLSlotElement | null = this.renderRoot.querySelector('slot')
    if (slot) return slot
  }

  firstUpdated(): void {
    if (!this.route) navigate(this.getUrlRoute() as string)
  }

  /**
   * @description Watcher for properties
   *              Call _eventDispatcher to dispatch custom events
   * @returns {void}
   */
  updated(props: PropertyValues): void {
    this.eventDispatcher(props)
    this.addUrlChangedHandler(props)
  }

  private getUrlRoute(): string | undefined {
    if (this.useHash) return location.hash.replace('#', '')
    const pathname = location.pathname.replace('/', '')
    if (this.contextPath) return pathname.replace(this.contextPath, '').replace('/', '')
    if (!this.contextPath) return pathname
  }

  /**
   * @description dispatch changed events for properties ( contextPath, pages, title, route )
   *
   * @param {PropertyValues} props
   * @returns {void}
   */
  private eventDispatcher(props: PropertyValues): void {
    if (props.has('contextPath')) {
      this.dispatchEvent(
        new CustomEvent('pagesChanged', {
          detail: {
            old: { key: 'contextPath', value: props.get('contextPath') },
            new: { key: 'contextPath', value: this.contextPath },
          },
        })
      )
    }

    if (props.has('pages')) {
      this.dispatchEvent(
        new CustomEvent('pagesChanged', {
          detail: {
            old: { key: 'pages', value: props.get('pages') },
            new: { key: 'pages', value: this.pages },
          },
        })
      )
    }

    if (props.has('title')) {
      this.dispatchEvent(
        new CustomEvent('titleChanged', {
          detail: {
            old: { key: 'title', value: props.get('title') },
            new: { key: 'title', value: this.title },
          },
        })
      )
    }

    if (props.has('route')) {
      this.dispatchEvent(
        new CustomEvent('routeChanged', {
          detail: {
            old: { key: 'route', value: props.get('route') },
            new: { key: 'route', value: this.route },
          },
        })
      )
    }
  }

  private addUrlChangedHandler(props: PropertyValues): void {
    if (props.has('useHash') && this.useHash) {
      window.addEventListener('hashchange', () => (this.route = window.location.hash.replace('#', '')))
    }
    if (props.has('useHash') && !this.useHash) {
      window.addEventListener('popstate', (e) => {
        let pathname: string = window.location.pathname.replace('/', '')
        if (this.contextPath) pathname = pathname.replace(this.contextPath, '').replace('/', '')
        this.__history_back_flag__ = true
        this.route = pathname
      })
    }
  }

  private addHashChangeHandler(props: PropertyValues): void {}

  /**
   * @description Find and return by route from pages property
   *
   * @param {String} route
   * @returns {Element} page element
   */
  getPageElementByRoute(route: string): HTMLElement | void {
    if (this.pageSlot) {
      return this.pageSlot
        .assignedElements()
        .find((page: Element) => page.getAttribute('route') === route) as HTMLElement
    }
  }

  /**
   * @description append page element into content element
   *
   * @param {String} route
   * @returns {void}
   */
  private async importElement(route: string): Promise<void> {
    if (!this.checkImported(route)) {
      const page: PageDetail | undefined = this.pages.find((page: PageDetail) => page.route === route)
      if (page) {
        await page.importer.call(page.importer)
        switchToImported(page.route)
      }
    }
  }

  /**
   * @description Check whether page is appended into content already or not.
   *
   * @param {String} route
   * @returns {Boolean}
   */
  private checkImported(route: string): boolean | void {
    const page: PageDetail | undefined = this.pages.find((page: PageDetail) => page.route === route)
    if (page) {
      return Boolean(page.imported)
    }
  }

  private updateRoute(title: string = this.title, route: string = this.route, data?: {}): void {
    if (route === (null || undefined)) return
    if (this.useHash) {
      this.changeHash(route)
    } else {
      this.updateHistory(title, route, data)
    }
  }

  private changeHash(route: string): void {
    if (
      location.pathname.split('/').join('') !== this.contextPath?.split('/').join('') ||
      location.hash.replace('#', '') !== route
    ) {
      const redirectLocation: URL = new URL(location.origin)
      if (this.contextPath) redirectLocation.pathname = `${this.contextPath}`
      redirectLocation.hash = route
      window.location.href = redirectLocation.href
    }
  }

  private updateHistory(title: string, route: string, data?: {}): void {
    let pathname: string = location.pathname.replace('/', '')
    if (this.contextPath) pathname = this.contextPath
    if (route !== (null || undefined)) pathname = `/${pathname}/${route}`

    if (this.__history_back_flag__) {
      window.history.replaceState(data, title, pathname)
      this.__history_back_flag__ = false
    } else {
      window.history.pushState(data, title, pathname)
    }
  }

  /**
   * @description Find page element by route and remove show attribute
   *
   * @param {String} route
   * @returns {void}
   */
  private hidePage(route: string): void {
    const page: HTMLElement | void = this.getPageElementByRoute(route)
    if (page) {
      page.removeAttribute('show')
    }
  }

  /**
   * @description Find page element by route and add show attribute
   *
   * @param {String} route
   * @returns {void}
   */
  private showPage(route: string): void {
    const page: HTMLElement | void = this.getPageElementByRoute(route)
    if (page) {
      page.setAttribute('show', '')
    }
  }

  stateChanged(state: any): void {
    this.title = state?.route?.title || this.title
    this.route = typeof state?.route?.route === 'string' ? state.route.route : this.route
    this.pages = state?.route?.pages || this.pages
  }
}
