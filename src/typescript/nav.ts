import * as d3 from "d3";
import { history } from "d3-history";

/*---------- NAVIGATION ----------*/

const setupNav = () => {
  const navData = [
    ["analyse", "navAnalysis", "vis"],
    ["help", "navHelp", "help"],
    ["options", "settings", "options"],
  ];

  navData.forEach((data) => {
    d3.select("#icon-" + data[0])
      .attr("href", browser.runtime.getURL("html/" + data[2] + ".html"));

    d3.select("#label-" + data[0])
      .text(browser.i18n.getMessage(data[1]));
  });
};

const setupVersion = () => {
  d3.select("#version")
    .text("v" + browser.runtime.getManifest().version);
};

/*---------- D3-HISTORY ----------*/

class StateManager {

  private default = {
    view: "selection",
  };
  private _urlState: any = {};
  private _localState: any = {};
  private _dispatcher = history("action");

  private _updateView: any;

  get urlState() {
    return this._urlState;
  }

  get localState() {
    return this._localState;
  }

  get dispatcher() {
    return this._dispatcher;
  }

  constructor(updateView: any) {

    this._updateView = updateView;

    this._dispatcher.on("action", () => {
      this.change();
    });

    window.addEventListener("popstate", () => {
      this.retrieveUrl();
    });
  }

  public retrieveUrl() {
    this._urlState = {};
    const comps = window.location.href.split("?");
    if (comps.length > 1) {
      const cs = comps[1].split("&");
      cs.forEach((c) => {
        const el = c.split("=");
        this._urlState[el[0]] = el[1];
      });
    }

    if (!("view" in this._urlState)) {
      this._urlState.view = this.default.view;
    }

    this.updateState();
  }

  public update() {
    this._dispatcher.call("action", this, this.createURL());
  }

  private updateState() {
    let changed = false;
    for (const key in this._urlState) {
      if (!(key in this._localState) || this._localState[key] !== this._urlState[key]) {
        changed = true;
      }
    }
    if (changed) {
      this.change();
    }
  }

  private change() {
    this._localState = this._urlState;
    this._updateView();
  }

  private createURL() {
    const keys = [];
    Object.keys(this._urlState).forEach((key) => {
      keys.push(key + "=" + this._urlState[key]);
    });
    return "?" + keys.join("&");
  }

}

export { setupNav, setupVersion, StateManager };
