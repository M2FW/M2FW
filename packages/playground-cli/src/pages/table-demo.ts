import {
  ColumnAlign,
  ColumnConfig,
  ColumnTypes,
  M2Table,
  ObjectColumnConfig,
} from '@m2fw/table/src'
import {
  LitElement,
  TemplateResult,
  customElement,
  html,
  property,
} from 'lit-element'

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
@customElement('table-demo')
export class TableDemo extends LitElement {
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
    `
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
}
