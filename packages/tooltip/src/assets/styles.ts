import { CSSResult, css } from 'lit-element'

export const styles: CSSResult = css`
  [tooltip-box] {
    display: flex;
    flex-direction: column;
    width: 0px;
    height: 0px;
    max-width: var(--m2-tooltip-box-max-width, 400px);
    max-height: var(--m2-tooltip-box-max-height, 200px);

    border: 1px solid black;
    border-radius: 5px;
    background-color: white;

    box-shadow: var(--m2-tooltip-box-shadow, 3px 3px 3px rgba(0, 0, 0, 0.6));

    padding: var(--m2-tooltip-box-padding, 0px 5px 5px 5px);

    transition-property: width, height;
    transition-duration: 0.3s;
    transition-timing-function: ease-in-out;
  }
  :host([show]) [tooltip-box] {
    width: var(--m2-tooltip-box-width, 200px); /* When it's changed, 'defaultWidth' also has to be changed */
    height: var(--m2-tooltip-box-height, 100px); /* When it's changed, 'defaultHeight' also has to be changed */

    transition-property: width, height;
    transition-duration: 0.3s;
    transition-timing-function: ease-in-out;
  }
  [tooltip-box][resizable] {
    resize: both;
    overflow: auto;
  }
  [subject] {
    font-size: var(--m2-tooltip-subject-font-size, 10pt);
  }
  section[header] {
    display: flex;
  }
  button {
    background: none;
    border: none;
    outline: none;
    margin: auto 0px auto auto;
  }
  [pin-icon] {
    color: var(--m2-tooltip-pin-icon-color, black);
    font-size: var(--m2-tooltip-pin-icon-font-size, medium);
    transform: rotate(25deg);
    margin: auto;
  }
  [pin-icon]:hover {
    color: var(--m2-tooltip-pin-icon-hover-color, black);
    transform: rotate(0deg);
  }
  [pin-icon][pinned] {
    transform: rotate(0deg);
  }
  [content] {
    font-size: var(--m2-tooltip-content-font-size, 10pt);
    flex: 1;
    overflow-y: auto;
  }
`
