import { ColumnAlign, ColumnConfig, ColumnTypes } from '@m2fw/table'
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
      name: 'createdAt',
      header: '생성일시',
      width: 180,
      hidden: false,
      align: ColumnAlign.Center,
    },
    {
      name: 'creator',
      header: '생성자',
      type: ColumnTypes.Object,
      width: 200,
      hidden: false,
      align: ColumnAlign.Center,
    },
    {
      name: 'updatedAt',
      header: '수정일시',
      width: 180,
      hidden: false,
      align: ColumnAlign.Center,
    },
    {
      name: 'updater',
      header: '수정자',
      type: ColumnTypes.Object,
      width: 200,
      hidden: false,
      align: ColumnAlign.Center,
    },
  ]

  @property({ type: Array }) data = []

  render(): TemplateResult {
    return html`
      <m2-table .columns="${this.columns}" .data="${this.data}"></m2-table>
    `
  }
}
