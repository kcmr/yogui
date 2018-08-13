import {PolymerElement, html} from '@polymer/polymer/polymer-element.js';

/**
 * `<{{name}}>` description.
 * @polymer
 * @customElement
 * @extends {PolymerElement}
 */
class {{titleCase(name)}} extends PolymerElement {
  static get template() {
    return html`
      <link rel="stylesheet" href="{{name}}.css" inline>
    `;
  }

  static get properties() {
    return {};
  }
}

customElements.define('{{name}}', {{titleCase(name)}});
