import {
  ColumnAlign,
  ColumnConfig,
  ColumnTypes,
  ObjectColumnConfig,
} from '@m2fw/table/src'
import {
  LitElement,
  TemplateResult,
  customElement,
  html,
  property,
} from 'lit-element'

@customElement('table-demo')
export class TableDemo extends LitElement {
  @property({ type: Array }) columns: ColumnConfig[] = [
    {
      name: 'id',
      primary: true,
      type: ColumnTypes.String,
      width: 100,
      hidden: true,
      align: ColumnAlign.Center,
    },
    {
      name: 'name',
      header: '설정 이름',
      type: ColumnTypes.String,
      width: 120,
      hidden: false,
      align: ColumnAlign.Center,
    },
    {
      name: 'category',
      header: '설정 유형',
      type: ColumnTypes.Object,
      renderEditor: (
        _config: ObjectColumnConfig,
        value: any,
        setValueHandler
      ): void => {
        console.log('current value is ', value)
        setTimeout(() => {
          setValueHandler({ name: 'Category Selected ' })
        }, 3000)
      },
      width: 140,
      hidden: false,
      align: ColumnAlign.Center,
    },
    {
      name: 'description',
      header: '설정 설명',
      type: ColumnTypes.String,
      width: 300,
      hidden: false,
      align: ColumnAlign.Left,
    },
    {
      name: 'value',
      header: '설정 값',
      type: ColumnTypes.String,
      width: 200,
      hidden: false,
      align: ColumnAlign.Left,
    },
    {
      name: 'updatedAt',
      header: '수정일시',
      width: 180,
      hidden: false,
      type: ColumnTypes.DateTime,
      align: ColumnAlign.Center,
    },
    {
      name: 'updater',
      header: '수정자',
      width: 200,
      hidden: false,
      align: ColumnAlign.Center,
    },
  ]

  @property({ type: Array }) data = [
    {
      id: 'c2d4e33c-7244-4d08-81d5-6395ac5fc90c',
      name: 'Test',
      category: 'SELLER_SETTING',
      description: 'test',
      value: 'test',
      createdAt: '1607757950766',
      creator: null,
      updatedAt: '1607757950766',
      updater: null,
    },
  ]

  render(): TemplateResult {
    return html`
      <m2-table .columns="${this.columns}" .data="${this.data}"></m2-table>
    `
  }
}
