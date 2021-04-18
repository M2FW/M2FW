import { CSSResult, LitElement, TemplateResult, css, customElement, html, property } from 'lit-element'
import { Tooltip, TooltipOptions } from '@m2fw/tooltip'
import { commonStyle, headerDisplayStyle } from '../assets/styles'

@customElement('m2-table-header-display-cell')
export class M2TableHeaderDisplayCell extends LitElement {
  @property({ type: Boolean }) batchEditable: boolean = false
  @property({ type: Object }) tooltipOptions?: TooltipOptions

  static get styles(): CSSResult[] {
    return [commonStyle, headerDisplayStyle]
  }

  render(): TemplateResult {
    return html`
      ${this.batchEditable ? this.renderBatchEditIcon() : ''}
      <slot></slot>
      ${this.tooltipOptions ? this.renderTooltipIcon() : ''}
    `
  }

  private renderBatchEditIcon(): TemplateResult {
    return html` <mwc-icon class="batch-edit-icon">edit</mwc-icon> `
  }

  private renderTooltipIcon(): TemplateResult {
    return html` <mwc-icon class="tooltip-icon" @click="${this.onTooltipIconClickHandler.bind(this)}">help</mwc-icon> `
  }

  private onTooltipIconClickHandler(event: MouseEvent): void {
    if (!this.tooltipOptions) throw new Error('Tooltip options is not configured properly')
    Tooltip.show(event.clientX, event.clientY, this.tooltipOptions)
  }
}
