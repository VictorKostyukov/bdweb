#! /usr/bin/env node

const NotSupportedException = require("./Exception.js").NotSupportedException;
const ObjectBase = require("./Object.js").ObjectBase;


class Api {
  constructor(obj) {
    this._obj = obj;
  }

  get type() {
    return this._obj.type;
  }

  get path() {
    return this._obj.path;
  }

  get __object() {
    return this._obj;
  }

  get __properties() {
    return this._obj.properties ? this._obj.properties : {};
  }

  __getProperty(key) {
    return this._obj.getProperty ? this._obj.getProperty(key) : undefined;
  }

  __hasProperty(key) {
    return this._obj.hasProperty ? this._obj.hasProperty(key) : false;
  }

  async __setProperty(key, val) {
    if (!this._obj.setProperty) {
      throw new NotSupportedException();
    }

    return await this._obj.setProperty(key, val);
  }

  async __setProperties(props) {
    if (!this._obj.setProperties) {
      throw new NotSupportedException();
    }

    return await this._obj.setProperties(props);
  }


  static async create(path) {
    let obj = ObjectBase.create(path);
    await obj.init();

    const apiType = require("../api/" + obj.type + "Api.js").Api;
    return new apiType(obj);
  }
}


module.exports = {
  Api : Api
};