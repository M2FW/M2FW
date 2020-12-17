import '../themes/app-themes.css'

import { css } from 'lit-element'

export const layoutStyle = css`
  :host {
    flex: 1;
    display: grid;
    grid-template-areas: var(--app-grid-template-areas);
    grid-template-rows: var(--app-grid-template-rows);
    grid-template-columns: var(--app-grid-template-columns);
  }
  header {
    grid-area: header;
  }
  nav {
    grid-area: nav;
  }
  main {
    grid-area: main;
    overflow: auto;
  }
  aside {
    grid-area: aside;
  }
  footer {
    grid-area: footer;
  }
`
