import { CSSResult, LitElement, PropertyValues, TemplateResult, customElement, html, property } from 'lit-element'
import { Events, HeaderEvents } from '..'
import { Tooltip, TooltipOptions } from '@m2-modules/tooltip'
import { commonStyle, headerDisplayStyle } from '../assets/styles'

@customElement('m2-table-header-display-cell')
export class M2TableHeaderDisplayCell extends LitElement {
  @property({ type: Boolean }) batchEditable: boolean = false
  @property({ type: Object }) tooltipOptions?: TooltipOptions
  @property({ type: Boolean }) sortable: boolean = false
  @property({ type: Boolean }) sortDesc?: boolean

  static get styles(): CSSResult[] {
    return [commonStyle, headerDisplayStyle]
  }

  render(): TemplateResult {
    return html`
      ${this.batchEditable ? this.renderBatchEditIcon() : ''}
      <slot></slot>
      ${this.sortable ? this.renderSortIcon() : ''} ${this.tooltipOptions ? this.renderTooltipIcon() : ''}
    `
  }

  updated(changedProps: PropertyValues): void {
    if (changedProps.has('sortDesc')) {
      this.dispatchEvent(
        new CustomEvent(HeaderEvents.SortChanged, {
          detail: { desc: this.sortDesc },
          composed: true,
          bubbles: true,
          cancelable: true,
        })
      )
    }
  }

  private renderBatchEditIcon(): TemplateResult {
    return html` <mwc-icon class="batch-edit-icon">edit</mwc-icon> `
  }

  private renderSortIcon(): TemplateResult {
    return html`
      <mwc-icon class="sort-icon" @click="${this.shuffleSortDesc.bind(this)}"
        >${this.sortDesc === undefined ? 'sort' : this.sortDesc ? 'arrow_downward' : 'arrow_upward'}</mwc-icon
      >
    `
  }

  private renderTooltipIcon(): TemplateResult {
    return html` <mwc-icon class="tooltip-icon" @click="${this.onTooltipIconClickHandler.bind(this)}">help</mwc-icon> `
  }

  private onTooltipIconClickHandler(event: MouseEvent): void {
    if (!this.tooltipOptions) throw new Error('Tooltip options is not configured properly')
    Tooltip.show(event.clientX, event.clientY, this.tooltipOptions)
  }

  private shuffleSortDesc(): void {
    const steps: any[] = [undefined, false, true]
    const currentStepIdx: number = steps.findIndex((step: any) => step === this.sortDesc)
    this.sortDesc = steps[(currentStepIdx + 1) % steps.length]
  }
}
