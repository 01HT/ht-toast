"use strict";
import { LitElement, html, css } from "lit-element";
import "@polymer/paper-toast";
import "@polymer/paper-button";

class HTToast extends LitElement {
  static get styles() {
    return css`
      a {
        text-decoration: none;
        color: inherit;
        outline: none;
        padding: 0;
        margin: 0;
      }

      paper-toast {
        max-width: 568px;
        min-width: 288px;
      }

      [connection] {
        text-align: center;
        margin: 24px 0 0 0;
      }

      paper-button {
        margin-left: 48px;
        font-weight: 500;
        padding: 0;
        margin: 0;
        color: #eeff41;
        height: 20px;
        float: right;
      }

      [hidden] {
        display: none;
      }
    `;
  }

  render() {
    const {
      connectionToast,
      closeToast,
      linkToast,
      smallScreen,
      link,
      linkTitle
    } = this;
    return html`
      <paper-toast ?connection="${connectionToast}" .horizontal-align="${
      connectionToast ? "center" : "left"
    }" class="${smallScreen ? "fit-bottom" : ""}" @iron-overlay-closed="${
      this._toastClosed
    }"><paper-button ?hidden="${!closeToast}" @click="${
      this._closeToast
    }">Закрыть</paper-button>
      <a href="${link}" ?hidden="${!linkToast}" @click="${
      this._closeToast
    }"><paper-button>${linkTitle}</paper-button></a></paper-toast>
`;
  }

  static get properties() {
    return {
      store: { type: Array },
      text: { type: String },
      link: { type: String },
      linkTitle: { type: String },
      duration: { type: Number },
      linkToast: { type: Boolean },
      closeToast: { type: Boolean },
      connectionToast: { type: Boolean },
      smallScreen: { type: Boolean }
    };
  }

  constructor() {
    super();
    this.store = [];
    this.text = "";
    this.link = "";
    this.linkTitle = "";
    this.duration = 3000;
    this.linkToast = false;
    this.closeToast = false;
    this.connectionToast = false;
  }

  _resetToast() {
    this.text = "";
    this.link = "";
    this.linkTitle = "";
    this.duration = 3000;
    this.linkToast = false;
    this.closeToast = false;
    this.connectionToast = false;
  }

  get toast() {
    return this.shadowRoot.querySelector("paper-toast");
  }

  showToast(options) {
    this.store.push(options);
    this._handleStore();
  }

  _handleStore() {
    if (this.store.length === 0) return;
    this._showToast(this.store[0]);
  }

  _showToast(options) {
    options.text !== undefined ? (this.text = options.text) : (this.text = "");
    options.duration !== undefined
      ? (this.duration = options.duration)
      : (this.duration = 3000);
    switch (options.type) {
      case "link":
        this.linkToast = true;
        this.link = options.link;
        this.linkTitle = options.linkTitle;
        break;
      case "offline":
        this.duration = 5000;
        this.connectionToast = true;
        this.text = "Вы оффлайн";
        break;
      case "online":
        this.duration = 5000;
        this.connectionToast = true;
        this.text = "Вы снова онлайн";
        break;
      case "close":
        this.closeToast = true;
        break;
      default:
        break;
    }
    this.toast.show({
      text: this.text,
      duration: this.duration
    });
  }

  _closeToast() {
    this.toast.close();
  }

  _toastClosed() {
    this._resetToast();
    this.store.splice(0, 1);
    this._handleStore();
  }
}

customElements.define("ht-toast", HTToast);
