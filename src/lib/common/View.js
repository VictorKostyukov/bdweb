#! /usr/bin/env node

const Api = require("./Api.js").Api;


class View {
  constructor(api) {
    this._api = api;
  }


  get api() {
    return this._api;
  }


  async init() {
    return true;
  }


  model() {
    return this.__render({});
  }


  __render(data) {
    return {
      Path : this._api.path,
      Type : this._api.type,
      Model : data
    };
  }


  static async create(path) {
    let api = await Api.create(path);

    let type = api.type + "View";
    const viewType = require(`../view/${type}.js`)[type];
    return new viewType(api);
  }
}


module.exports = {
  View : View
};
