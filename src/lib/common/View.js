#! /usr/bin/env node

const Api = require("./Api.js").Api;


class View {
  constructor(api) {
    this._api = api;
  }


  get api() {
    return this._api;
  }

  get security() {
    return this.api.security;
  }

  get request() {
    return this.api.request;
  }

  get response() {
    return this.api.response;
  }


  async model() {
    return this.__render({});
  }


  __render(data, title, nav) {
    if (nav) {
      if (!data) {
        data = {};
      }
      if (!data.view) {
        data.view = {};
      }
      if (!data.view.navigationBar) {
        data.view.navigationBar = {};
      }

      data.view.navigationBar.current = nav;
    }
    return {
      Path : this._api.path,
      Type : this._api.type,
      Title : title ? title : "",
      Model : data
    };
  }


  static async create(path, req, res) {
    let api = await Api.create(path, req, res);

    let type = api.type + "View";
    const viewType = require(`../view/${type}.js`)[type];
    return new viewType(api);
  }
}


module.exports = {
  View : View
};
