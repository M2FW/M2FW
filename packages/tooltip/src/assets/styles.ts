import { CSSResult, css } from 'lit-element'

export const styles: CSSResult = css`
  [tooltip-box] {
    display: flex;
    flex-direction: column;
    min-width: var(--m2-tooltip-box-min-width, 40px);
    min-height: var(--m2-tooltip-box-min-height, 30px);
    width: 0px;
    height: 0px;
    max-width: var(--m2-tooltip-box-max-width, 800px);
    max-height: var(--m2-tooltip-box-max-height, 600px);

    border: 1px solid black;
    border-radius: 5px;
    background-color: white;

    transition-property: width, height;
    transition-duration: 1.5s;
    transition-timing-function: ease-in-out;
  }
  :host([show]) [tooltip-box] {
    width: var(--m2-tooltip-box-width, 400px);
    height: var(--m2-tooltip-box-height, 300px);

    transition-property: width, height;
    transition-duration: 1.5s;
    transition-timing-function: ease-in-out;
  }
  [tooltip-box][resizable] {
    resize: both;
    overflow: auto;
  }
  [subject] {
    font-size: var(--m2-tooltip-subject-font-size, 10pt);
  }
  [content] {
    font-size: var(--m2-tooltip-content-font-size, 12pt);
    flex: 1;
  }
`
