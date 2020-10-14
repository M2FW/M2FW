import { css, CSSResult } from 'lit-element'

export const headerStyle: CSSResult = css`
  :host {
    display: table-header-group;
    width: max-content;
  }
  :host > * {
    font-size: var(--m2-table-header-font-size, 12px);
    color: var(--m2-table-header-font-color, white);
  }
  button {
    visibility: hidden;
    display: flex;
    padding: var(--m2-table-button-padding, 0px);
    margin: var(--m2-tablebutton-margin, 0px);
    width: var(--m2-table-button-width, 20px);
    height: var(--m2-table-button-height, 20px);
  }
  tr {
    background-color: var(--m2-table-header-bg-color, darkgray);
  }
  th {
    padding: var(--m2-table-cell-padding, 5px);
    border-top: var(--m2-table-cell-border-top, none);
    border-bottom: var(--m2-table-cell-border-bottom, none);
    border-left: var(--m2-table-cell-border-left, none);
    border-right: var(--m2-table-cell-border-right, none);
  }
`

export const bodyStyle: CSSResult = css`
  :host {
    display: table-row-group;
    overflow: auto;
    width: max-content;
    flex: 1;
    background-color: var(--m2-table-body-bg-color, lightgray);
  }
  :host > * {
    color: var(--m2-table-font-color, black);
    font-size: var(--m2-table-font-size, 11px);
  }
  :host .row-numbering {
    text-align: right;
  }
  :host::-webkit-scrollbar {
    display: none;
  }
  tr:nth-child(even) {
    background-color: var(--m2-table-even-row-bg-color, lightgray);
  }
  tr:nth-child(odd) {
    background-color: var(--m2-table-odd-row-bg-color, white);
  }
  tr[appended] {
    background-color: var(--m2-table-appended-row-bg-color, lightblue);
  }
  tr[changed] {
    background-color: var(--m2-table-changed-row-bg-color, lightgreen);
  }
  tr[deleted] {
    background-color: var(--m2-table-deleted-row-bg-color, indianRed);
    text-decoration-line: var(
      --m2-table-deleted-row-text-decoration,
      line-through
    );
  }
  td {
    padding: var(--m2-table-cell-padding, 5px);
    border-top: var(--m2-table-cell-border-top, none);
    border-bottom: var(--m2-table-cell-border-bottom, none);
    border-left: var(--m2-table-cell-border-left, none);
    border-right: var(--m2-table-cell-border-right, none);
  }
  button {
    display: flex;
    padding: var(--m2-table-button-padding, 0px);
    margin: var(--m2-tablebutton-margin, 0px);
    width: var(--m2-table-button-width, 20px);
    height: var(--m2-table-button-height, 20px);
    background: var(--m2-table-button-bg-color, transparent);
    border: var(--m2-table-button-border, none);
    border-radius: var(--m2-table-button-border-radius, none);
    outline: none;
  }
  button:hover {
    background: var(--m2-table-button-hover-bg-color, inherit);
    border: var(--m2-table-button-hover-border, none);
  }
`

export const cellStyle: CSSResult = css`
  :host {
    flex: 1;
    display: grid;
    outline: none;
    border: 1px solid transparent;
  }
  :host(:focus) {
    border: 1px dashed gray;
  }
  :host > * {
    margin: auto 0;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    outline: none;
    border: none;
    background-color: transparent;
    font-family: inherit;
  }
  :host(.align-left) > * {
    margin: auto auto auto 0px;
  }
  :host(.align-right) > * {
    margin: auto 0px auto auto;
  }
  :host(.align-center) > * {
    margin: auto;
  }
`
