import {PolymerElement, html} from '@polymer/polymer/polymer-element.js';

/**
 * `<{{name}}>` description.
 * @polymer
 * @customElement
 * @extends {PolymerElement}
 */
class {{titleCase(name)}} extends PolymerElement {
  static get template() {
    return html``;
  }

  static get properties() {
    return {};
  }
}

customElements.define('{{name}}', {{titleCase(name)}});
