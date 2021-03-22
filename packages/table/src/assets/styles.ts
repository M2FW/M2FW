import { CSSResult, css } from 'lit-element'

export const commonStyle: CSSResult = css`
  .selector {
    text-align: center;
    width: var(--m2-table-selector-width, 30px);
  }
  .numbering {
    width: var(--m2-table-numbering-width, 30px);
  }
`

export const headerStyle: CSSResult = css`
  :host {
    display: table-header-group;
    width: max-content;
  }
  :host > * {
    font-size: var(--m2-table-header-font-size, 12px);
    color: var(--m2-table-header-font-color, white);
  }
  :host .header-numbering {
    width: var(--m2-table-row-number-width, 30px);
  }
  button {
    visibility: hidden;
    display: flex;
    padding: var(--m2-table-button-padding, 0px);
    margin: var(--m2-table-button-margin, 0px);
    width: var(--m2-table-button-width, 20px);
    height: var(--m2-table-button-height, 20px);
  }
  tr {
    height: var(--m2-table-header-row-height, 30px);
    background-color: var(--m2-table-header-bg-color, darkgray);
  }
  th {
    padding: var(--m2-table-cell-padding, 5px);
    border-width: var(--m2-table-cell-border-width, 0 1px 0 0);
    border-style: var(--m2-table-header-cell-border-style, solid);
    border-color: var(--m2-table-header-cell-border-color, gray);
  }
  th.resizable {
    cursor: col-resize;
    border-color: var(--m2-table-header-cell-resizable-border-color, lightgray);
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
    color: transparent;
    text-shadow: 0 0 0 var(--m2-table-font-color, black);
    font-size: var(--m2-table-font-size, 11px);
  }
  :host .row-numbering {
    text-align: var(--m2-table-row-number-align, right);
    width: var(--m2-table-row-number-width, 30px);
  }
  :host::-webkit-scrollbar {
    display: none;
  }
  tr {
    height: var(--m2-table-row-height, 30px);
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
    text-decoration-line: var(--m2-table-deleted-row-text-decoration, line-through);
  }
  tr[selected] {
    background-color: var(--m2-table-selected-row-bg-color, yellow);
    font-style: var(--m2-table-selected-font-style, italic);
  }
  td {
    padding: var(--m2-table-cell-padding, 5px);
    border-width: var(--m2-table-cell-border-width, 0 1px 0 0);
    border-style: var(--m2-table-cell-border-style, solid);
    border-color: var(--m2-table-cell-border-color, transparent);
  }
  td,
  span {
    font-size: inherit;
  }
  button {
    display: flex;
    padding: var(--m2-table-button-padding, 0px);
    margin: var(--m2-table-button-margin, 0px);
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
    width: inherit;
  }
  :host(:focus) {
    border: 1px dashed gray;
  }
  :host > * {
    margin: auto 0;
    overflow: hidden;
    white-space: nowrap;
    outline: none;
    border: none;
    background-color: transparent;
  }
  :host([invalid]) {
    background-color: var(--m2-table-cell-invalid-bg-color, inherit);
    border-width: var(--m2-table-cell-invalid-border-width, 0px 0px 1px 0px);
    border-style: var(--m2-table-cell-invalid-border-style, dashed);
    border-color: var(--m2-table-cell-invalid-border-color, tomato);
  }
  :host(.align-left) .dsp-cell > span {
    margin: auto auto auto 0px;
  }
  :host(.align-right) .dsp-cell > span {
    margin: auto 0px auto auto;
  }
  :host(.align-center) .dsp-cell > span {
    margin: auto;
  }
  .dsp-cell {
    display: flex;
  }
  input,
  select {
    padding: 0;
    font-size: inherit;
    width: inherit;
  }
  .dsp-cell {
    width: inherit;
  }
`

export const indicatorStyle = css`
  #page-indicator {
    margin: var(--m2-table-page-indicator-margin);
    padding: var(--m2-table-page-indicator-padding, 5px);
    font-size: var(--m2-table-page-indicator-font-size, 11px);
    display: flex;
    background-color: var(--m2-table-page-indicator-bg-color, gray);
  }
  #page-controller {
    display: flex;
    padding: var(--m2-table-section-padding, 5px);
    background-color: var(--m2-table-page-controller-bg-color, lightgray);
    border-radius: var(--m2-table-section-border-radius, 5px);
  }
  .move-button {
    margin: var(--m2-table-move-button-margin);
  }
  .move-button > mwc-icon {
    font-size: inherit;
    margin: auto;
  }
  #limit-controller {
    display: grid;
    grid-auto-flow: column;
    grid-gap: 5px;
    margin: auto 0px auto auto;
    padding: var(--m2-table-section-padding, 5px);
    background-color: var(--m2-table-limit-controller-bg-color, lightgray);
    border-radius: var(--m2-table-section-border-radius, 5px);
  }
  #page-info {
    display: grid;
    grid-auto-flow: column;
    grid-gap: 5px;
    margin: auto 0px auto 10px;
    padding: var(--m2-table-section-padding, 5px);
    background-color: var(--m2-table-page-info-bg-color, lightgray);
    border-radius: var(--m2-table-section-border-radius, 5px);
  }
  input {
    outline: none;
    border: none;
    padding: 0px;
    font-size: inherit;
    background-color: transparent;
    width: 30px;
  }
  button {
    padding: 0px;
    display: flex;
    outline: none;
    font-size: inherit;
    background-color: var(--m2-table-indicator-button-bg-color, transparent);
    border: var(--m2-table-indicator-button-border, none);
  }
`
