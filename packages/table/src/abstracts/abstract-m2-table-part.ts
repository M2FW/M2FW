import { ColumnConfig, RowSelectorOption, TableButton } from '../interfaces'
import { LitElement, PropertyValues, property } from 'lit-element'

export abstract class AbstractM2TablePart extends LitElement {
  @property({ type: Array }) columns: (ColumnConfig | any)[] = []
  @property({ type: Array }) buttons: TableButton[] = []
  @property({ type: Boolean }) numbering: boolean = true
  @property({ type: Object }) selectable: RowSelectorOption | any = {
    exclusive: false,
    fieldIdentifier: 'id',
    stackSelection: true,
    handySelector: true,
    oneClickSelect: false,
  }
  @property({ type: Boolean }) addable: boolean = true
  @property({ type: Boolean }) removable: boolean = true
  @property({ type: Number }) minColumnWidth: number = 0
  @property({ type: Number }) maxColumnWidth: number = Infinity
  @property({ type: Number }) fixedColumnCount: number = 0

  private setStickyColumnStyleTimeout?: NodeJS.Timeout

  updated(changedProps: PropertyValues): void {
    if (changedProps.has('buttons')) this.setStickyColumnStyle()
  }

  async setStickyColumnStyle(): Promise<void> {
    if (this.setStickyColumnStyleTimeout) clearTimeout(this.setStickyColumnStyleTimeout)
    this.setStickyColumnStyleTimeout = setTimeout(async () => {
      await this.updateComplete

      let fixedColumnCount: number = this.fixedColumnCount
      if (fixedColumnCount <= 0) {
        fixedColumnCount = 0
      }

      const standardCells: HTMLElement[] = Array.from(
        this.renderRoot.querySelectorAll(`th[columnIdx='${fixedColumnCount}'], td[columnIdx='${fixedColumnCount}']`)
      ) as HTMLElement[]

      if (!standardCells?.length) return

      standardCells.forEach((standardCell: HTMLElement) => {
        let targetElement: HTMLElement = standardCell?.parentElement?.firstElementChild as HTMLElement

        let leftPosition: number = 0

        while (targetElement !== standardCell) {
          targetElement.setAttribute('sticky', '')
          targetElement.style.left = leftPosition + 'px'

          leftPosition += targetElement.offsetWidth
          targetElement = targetElement.nextElementSibling as HTMLElement
        }
      })
    }, 100)
  }
}
