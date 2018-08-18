import {PolymerElement, html} from '@polymer/polymer/polymer-element.js';

/**
 * `<{{componentName}}>` description.
 * @polymer
 * @customElement
 * @extends {PolymerElement}
 */
class {{titleCase(componentName)}} extends PolymerElement {
  static get template() {
    return html``;
  }

  static get properties() {
    return {};
  }
}

customElements.define('{{componentName}}', {{titleCase(componentName)}});
