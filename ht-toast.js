"use strict";
import { LitElement, html } from "../@polymer/lit-element/lit-element.js";
import "../@polymer/paper-toast/paper-toast.js";
import "../@polymer/paper-button/paper-button.js";

class HTToast extends LitElement {
  render({
    text,
    link,
    linkTitle,
    duration,
    linkToast,
    closeToast,
    connectionToast,
    smallScreen
  }) {
    return html`
      <style>
        a {
          text-decoration: none;
          color: inherit;
          outline: none;
          padding:0;
          margin:0;
        }

        paper-toast {
          max-width:568px;
          min-width: 288px;
        }

        paper-button {
          margin-left:48px;
          font-weight:500;
          padding:0;
          margin:0;
          color:#eeff41;
          height:20px;
          float: right;
        }

        [hidden] {
          display:none;
        }
      </style>
      <paper-toast style$='${
        connectionToast ? "text-align:center; margin:24px 0 0 0;" : ""
      }'  horizontal-align$='${connectionToast ? "center" : "left"}' class$=${
      smallScreen ? "fit-bottom" : ""
    } on-iron-overlay-closed=${e => {
      this._toastClosed();
    }}><paper-button hidden?=${!closeToast} onclick=${e => {
      this._closeToast();
    }}>Закрыть</paper-button>
      <a href=${link} hidden?=${!linkToast} onclick=${e => {
      this._closeToast();
    }}><paper-button>${linkTitle}</paper-button></a></paper-toast>
`;
  }

  static get is() {
    return "ht-toast";
  }

  static get properties() {
    return {
      store: Array,
      text: String,
      link: String,
      linkTitle: String,
      duration: Number,
      linkToast: Boolean,
      closeToast: Boolean,
      connectionToast: Boolean,
      smallScreen: Boolean
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
    console.log(this.connectionToast);
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

customElements.define(HTToast.is, HTToast);
