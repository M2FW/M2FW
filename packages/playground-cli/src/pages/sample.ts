import '@m2fw/dialog/src'

import {
  ColumnAlign,
  ColumnConfig,
  ColumnTypes,
  M2Table,
} from '@m2fw/table/src'
import {
  LitElement,
  PropertyValues,
  TemplateResult,
  customElement,
  html,
  property,
} from 'lit-element'

import { connect } from 'pwa-helpers/connect-mixin'
import { navigate } from '@m2fw/router/src'
import { openDialog } from '@m2fw/dialog/src'
import { store } from '@m2fw/redux-manager'

interface User {
  id?: string
  name?: string
}

interface Setting {
  id?: string
  name?: string
  category?: string
  description?: string
  value?: string
  createdAt?: string
  creator?: User
  updatedAt?: string
  updater?: User
}
@customElement('sample-page')
export class Sample extends connect(store)(LitElement) {
  @property({ type: Array }) columns: ColumnConfig[] = [
    {
      name: 'name',
      header: '설정 이름',
      type: ColumnTypes.String,
      width: 120,
      hidden: false,
      editable: true,
      align: ColumnAlign.Center,
    },
    {
      name: 'category',
      header: '설정 유형',
      type: ColumnTypes.Select,
      options: [
        { display: 'Seller setting', value: 'SELLER_SETTING' },
        { display: 'Supplier setting', value: 'SUPPLIER_SETTING' },
      ],
      width: 140,
      hidden: false,
      editable: true,
      align: ColumnAlign.Center,
    },
    {
      name: 'description',
      header: '설정 설명',
      type: ColumnTypes.String,
      width: 300,
      hidden: false,
      editable: true,
      align: ColumnAlign.Left,
    },
    {
      name: 'value',
      header: '설정 값',
      type: ColumnTypes.String,
      width: 200,
      hidden: false,
      editable: true,
      align: ColumnAlign.Left,
    },
    {
      name: 'hidden',
      header: '숨김',
      type: ColumnTypes.Boolean,
      width: 60,
      align: ColumnAlign.Center,
      editable: true,
    },
    {
      name: 'updatedAt',
      header: '수정일시',
      width: 180,
      hidden: false,
      type: ColumnTypes.DateTime,
      align: ColumnAlign.Center,
      editable: false,
    },
    {
      name: 'updater',
      header: '수정자',
      width: 200,
      hidden: false,
      type: ColumnTypes.Object,
      align: ColumnAlign.Center,
      editable: false,
    },
  ]

  @property({ type: Array }) data: Setting[] = [
    {
      id: 'c2d4e33c-7244-4d08-81d5-6395ac5fc90c',
      name: 'Test',
      category: 'SELLER_SETTING',
      description: 'test',
      value: 'test',
      createdAt: '1607757950766',
      creator: undefined,
      updatedAt: '1607757950766',
      updater: {
        name: 'Jay Lee',
      },
    },
  ]

  @property({ type: String }) route: string = location.pathname.replace(
    /^\//,
    ''
  )

  get table(): M2Table {
    const table: M2Table | null = this.renderRoot?.querySelector('m2-table')
    if (!table) throw new Error('Failed to find table')

    return table
  }

  render(): TemplateResult {
    return html`
      <m2-table
        .selectable="${true}"
        .columns="${this.columns}"
        .data="${this.data}"
        .addable="${false}"
      ></m2-table>
      <button @click="${this.refreshData}">Refresh</button>
      <button @click="${this.getParams}">Get Params</button>

      <button @click="${this.navigateToDetailView}">Go to Detail</button>
      <button @click="${this.openRandomDialog}">Open Random Dialog</button>

      <m2-dialog></m2-dialog>
    `
  }

  updated(changedProps: PropertyValues): void {
    if (changedProps.has('route')) {
      if (this.route !== location.pathname.replace(/^\//, '')) {
        window.history.pushState('', '', this.route)
      }
    }
  }

  refreshData(): void {
    const tempData: Record<string, any>[] = this.data.splice(0)
    this.data = []
    this.data = tempData
  }

  getParams(): void {
    console.log('Appended', this.table?.getAppended<Setting>())
    console.log('Changed Only', this.table?.getChangedOnly<Setting>())
    console.log('Changed', this.table?.getChanged<Setting>())
    console.log('Deleted', this.table?.getDeleted<Setting>())
  }

  navigateToDetailView(): void {
    const randomId: string = String(Date.now())
    navigate(`test/`)
  }

  openRandomDialog() {
    openDialog({
      template: {
        content: html` <div
          style="border: 1px solid black; border-radius: 0 0 5px 5px; flex: 1;"
        >
          <input />
        </div>`,
        header: html`<div
          style="border: 1px solid black; border-radius: 5px 5px 0 0; border-bottom: 0px;"
        >
          Header
        </div>`,
      },
    })
  }

  stateChanged(state: any) {
    this.route = state.route?.route
  }
}
