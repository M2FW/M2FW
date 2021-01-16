import '@material/mwc-icon'

import { CSSResult, LitElement, PropertyValues, TemplateResult, css, customElement, html, property } from 'lit-element'

import { indicatorStyle } from '../assets/styles'

@customElement('m2-table-page-indicator')
export class M2TablePageIndicator extends LitElement {
  @property({ type: Number }) page: number = 1
  @property({ type: Number }) limit: number = 50
  @property({ type: Number }) total: number = 0
  @property({ type: Number }) totalPage: number = 1

  @property({ type: Array }) limitationOptions: number[] = [20, 50, 100, 200, 500]
  @property({ type: Number }) maximumLimitation: number = 500

  static get styles(): CSSResult[] {
    return [indicatorStyle]
  }

  render(): TemplateResult {
    return html`
      <div id="page-indicator">
        <div id="page-controller">
          <button
            id="to-start-button"
            class="move-button"
            ?disabled="${this.page <= 1}"
            @click="${() => {
              this.page = 1
              this.resizePageInput()
              this.dispatchChangeEvent()
            }}"
          >
            <mwc-icon>first_page</mwc-icon>
          </button>

          <button
            id="to-prev-button"
            class="move-button"
            ?disabled="${this.page <= 1}"
            @click="${() => {
              this.page--
              this.resizePageInput()
              this.dispatchChangeEvent()
            }}"
          >
            <mwc-icon>chevron_left</mwc-icon>
          </button>

          <div id="page-quick-changer">
            <input
              id="page-input"
              type="number"
              min="1"
              max="${this.totalPage}"
              .value="${String(this.page)}"
              @input="${this.resizePageInput.bind(this)}"
              @change="${this.dispatchChangeEvent.bind(this)}"
            />
            <span>/</span>
            <span>${this.totalPage}</span>
          </div>

          <button
            id="to-next-button"
            class="move-button"
            ?disabled="${this.page >= this.totalPage}"
            @click="${() => {
              this.page++
              this.resizePageInput()
              this.dispatchChangeEvent()
            }}"
          >
            <mwc-icon>chevron_right</mwc-icon>
          </button>
          <button
            id="to-end-button"
            class="move-button"
            ?disabled="${this.page >= this.totalPage}"
            @click="${() => {
              this.page = this.totalPage
              this.resizePageInput()
              this.dispatchChangeEvent()
            }}"
          >
            <mwc-icon>last_page</mwc-icon>
          </button>
        </div>

        <div id="limit-controller">
          ${this.limitationOptions.map(
            (option: number) =>
              html`
                <button ?disabled="${this.limit === option}" @click="${() => (this.limit = option)}">
                  <span class="limit-option">${option}</span>
                </button>
              `
          )}
        </div>

        <div id="page-info">
          <span
            >${(this.page - 1) * this.limit + 1} -
            ${this.page * this.limit < this.total ? this.page * this.limit : this.total}
          </span>
          <span>of</span>
          <span>${this.total}</span>
        </div>
      </div>
    `
  }

  get pageInput(): HTMLInputElement {
    const input: HTMLInputElement | null = this.renderRoot.querySelector<HTMLInputElement>('#page-input')
    if (!input) throw new Error('Failed to find input')
    return input
  }

  updated(changedProps: PropertyValues): void {
    if (changedProps.has('limit') || changedProps.has('total')) {
      this.computeTotalPage(this.limit, this.total)
      this.dispatchChangeEvent()
    }
  }

  private computeTotalPage(limit: number, total: number): void {
    this.totalPage = Math.ceil(total / limit)
    if (this.page > this.totalPage) {
      this.page = this.totalPage
    }
  }

  private async resizePageInput(): Promise<void> {
    await this.updateComplete
    const valueLength: number = this.pageInput.value.length || 0
    const width: number = 30 + (valueLength - 1) * 10

    this.pageInput.style.width = `${width}px`
  }

  private dispatchChangeEvent(): void {
    this.dispatchEvent(
      new CustomEvent('pageChanged', {
        detail: {
          page: this.page,
          limit: this.limit,
        },
        bubbles: true,
        composed: true,
      })
    )
  }
}
