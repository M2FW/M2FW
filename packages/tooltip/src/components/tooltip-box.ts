import { CSSResult, LitElement, PropertyValues, TemplateResult, css, customElement, html, property } from 'lit-element'

import { TooltipOptions } from '../interfaces'
import { styles } from '../assets'

export const enum TooltipStyleVariables {
  TooltipBoxWidth = '--m2-tooltip-box-width',
  TooltipBoxHeight = '--m2-tooltip-box-height',
  TooltipBoxMaxWidth = '--m2-tooltip-box-max-width',
  TooltipBoxMaxHeight = '--m2-tooltip-box-max-height',
}

@customElement('tooltip-box')
class TooltipBox extends LitElement {
  @property({ type: String }) subject?: string
  @property({ type: String }) content?: string

  @property({ type: Number }) positionX: number = 0
  @property({ type: Number }) positionY: number = 0

  @property({ type: Number }) width?: number
  @property({ type: Number }) height?: number

  @property({ type: Boolean }) resizable: boolean = false

  @property({ type: Boolean, reflect: true }) show: boolean = false
  @property({ type: Boolean }) showContent: boolean = false

  @property({ type: Boolean }) pinned = false

  private readonly defaultWidth: number = 200 // When default value is changed, styles also has to be changed
  private readonly defaultHeight: number = 100 // When default value is changed, styles also has to be changed

  private mouseoutTimeout?: NodeJS.Timeout

  constructor() {
    super()
    this.onmouseout = this.onMouseoutHandler.bind(this)
  }

  static get styles(): CSSResult[] {
    return [
      styles,
      css`
        :host {
          display: none;
          position: absolute;
          z-index: 100;
        }
        :host([show]) {
          display: initial;
        }
      `,
    ]
  }

  get tooltipBox(): HTMLElement {
    const tooltipBox: HTMLElement | null = this.renderRoot.querySelector('[tooltip-box]')
    if (!tooltipBox) throw new Error('Failed to find tooltip box element')
    return tooltipBox
  }

  render(): TemplateResult {
    return html`
      <article tooltip-box ?resizable="${this.resizable}">
        ${this.showContent
          ? html`
              <section header>
                ${this.subject ? html` <h1 subject>${this.subject}</h1> ` : ''}
                <button @click="${this.onPinIconClickHandler.bind(this)}">
                  <mwc-icon pin-icon ?pinned="${this.pinned}">push_pin</mwc-icon>
                </button>
              </section>

              <section content>${this.content}</section>
            `
          : ''}
      </article>
    `
  }

  updated(changedProps: PropertyValues): void {
    if (changedProps.has('width') && this.width) this.setWidthProperty(this.width)
    if (changedProps.has('height') && this.height) this.setHeightProperty(this.height)

    if (changedProps.has('positionX')) this.setPositionX(this.positionX)
    if (changedProps.has('positionY')) this.setPositionY(this.positionY)
  }

  private setWidthProperty(width: number): void {
    if (width <= 0) throw new Error('width property should bigger than 0')
    this.style.setProperty(TooltipStyleVariables.TooltipBoxWidth, width + 'px')
    this.style.setProperty(TooltipStyleVariables.TooltipBoxMaxWidth, width * 2 + 'px')
  }

  private setHeightProperty(height: number): void {
    if (height <= 0) throw new Error('height property should bigger than 0')
    this.style.setProperty(TooltipStyleVariables.TooltipBoxHeight, height + 'px')
    this.style.setProperty(TooltipStyleVariables.TooltipBoxMaxHeight, height * 2 + 'px')
  }

  private setDefaultSizeProperty(): void {
    this.setWidthProperty(this.defaultWidth)
    this.setHeightProperty(this.defaultHeight)
  }

  private setPositionX(positionX: number = 0): void {
    this.style.left = positionX + 'px'
  }
  private setPositionY(positionY: number = 0): void {
    this.style.top = positionY + 'px'
  }

  private onMouseoutHandler(): void {
    if (this.mouseoutTimeout) clearTimeout(this.mouseoutTimeout)

    this.mouseoutTimeout = setTimeout(this.hideTooltipBox.bind(this), 2000)
  }

  private setDisplayInitial(): void {
    this.style.display = 'initial'
  }

  public showTooltipBox(): void {
    this.setDisplayInitial()
    setTimeout(() => {
      this.tooltipBox.ontransitionend = () => {
        this.showContent = true
      }

      this.show = true
    }, 0)
  }

  public hideTooltipBox(): void {
    if (this.pinned) return

    setTimeout(() => {
      this.tooltipBox.ontransitionend = () => {
        this.remove()
      }

      this.showContent = false
      this.show = false
      this.setDefaultSizeProperty()
    }, 0)
  }

  private onPinIconClickHandler(): void {
    if (!this.pinned) {
      this.pinned = true
    } else {
      this.pinned = false
      this.hideTooltipBox()
    }
  }
}

export class Tooltip {
  static show(positionX: number = 0, positionY: number = 0, options: TooltipOptions): void {
    const tooltipBox: TooltipBox = document.createElement('tooltip-box') as TooltipBox
    tooltipBox.positionX = positionX
    tooltipBox.positionY = positionY
    tooltipBox.resizable = options.resizable || false
    if (options.subject) tooltipBox.subject = options.subject
    tooltipBox.content = options.content

    if (options.width) tooltipBox.width = options.width
    if (options.height) tooltipBox.height = options.height

    document.body.appendChild(tooltipBox)
    tooltipBox.showTooltipBox()
  }
}
