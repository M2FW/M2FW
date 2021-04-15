import { CSSResult, LitElement, TemplateResult, css, customElement, html, property } from 'lit-element'
import { Tooltip, TooltipOptions } from '@m2fw/tooltip'

@customElement('m2-table-header-display-cell')
export class M2TableHeaderDisplayCell extends LitElement {
  @property({ type: Boolean }) batchEditable: boolean = false
  @property({ type: Object }) tooltipOptions?: TooltipOptions

  static get styles(): CSSResult[] {
    return [
      css`
        :host {
          width: inherit;
          display: flex;
          flex: 1;
          overflow: hidden;
        }
        ::slotted(*) {
          width: inherit;
          flex: 1;
        }
        ::slotted(span.header-text) {
          display: block !important;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
        }
        mwc-icon {
          font-size: var(--m2-table-header-icon-font-size, small);
          margin: auto 0px;
        }
        mwc-icon.batch-edit-icon {
          float: left;
        }
        mwc-icon.tooltip-icon {
          float: right;
          cursor: help;
          color: var(--m2-table-tooltip-icon-color, white);
        }
        mwc-icon.tooltip-icon:hover {
          color: var(--m2-table-tooltip-icon-hover-color, lightgreen);
        }
      `,
    ]
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
