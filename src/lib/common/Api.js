#! /usr/bin/env node

const NotSupportedException = require("./Exception.js").NotSupportedException;
const ObjectBase = require("./Object.js").ObjectBase;


class Api {
  constructor(obj) {
    this._obj = obj;
    this._request = null;
    this._response = null;
  }

  get type() {
    return this._obj.type;
  }

  get path() {
    return this._obj.path;
  }

  get request() {
    return this._request;
  }

  set request(val) {
    this._request = val;
  }

  get response() {
    return this._response;
  }

  set response(val) {
    this._response = val;
  }

  get object() {
    return this._obj;
  }

  get properties() {
    return this._obj.properties ? this._obj.properties : {};
  }

  getProperty(key) {
    return this._obj.getProperty ? this._obj.getProperty(key) : undefined;
  }

  hasProperty(key) {
    return this._obj.hasProperty ? this._obj.hasProperty(key) : false;
  }

  async setProperty(key, val) {
    if (!this._obj.setProperty) {
      throw new NotSupportedException();
    }

    return await this._obj.setProperty(key, val);
  }

  async setProperties(props) {
    if (!this._obj.setProperties) {
      throw new NotSupportedException();
    }

    return await this._obj.setProperties(props);
  }


  static async create(path, req, res) {
    let obj = ObjectBase.create(path);
    await obj.init();

    let type = obj.type + "Api";
    const apiType = require("../api/" + type + ".js")[type];
    let api = new apiType(obj);
    api.request = req;
    api.response = res;
    return api;
  }
}


module.exports = {
  Api : Api
};