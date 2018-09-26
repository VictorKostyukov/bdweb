#! /usr/bin/env node

const _exceptions = require("./Exception.js");
const NotSupportedException = _exceptions.NotSupportedException;
const InvalidArgumentException = _exceptions.InvalidArgumentException;
const ObjectBase = require("./Object.js").ObjectBase;
const Security = require("./Security.js").Security;


class Api {
  constructor(obj) {
    this._obj = obj;
    this._request = null;
    this._response = null;
    this._security = new Security();
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
    this._security = val.security ? val.security : this._security;
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

  get security() {
    return this._security;
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

  async getChildren(query, offset, limit) {
    let objs = await this._obj.getChildren(query, offset, limit);
    let result = [];
    if (objs) {
      for (let i = 0; i < objs.length; ++i) {
        result.push(Api.create(objs[i].Path, this.request, this.response, objs[i]));
      }
    }
    return result;
  }

  async getChildCount(query) {
    return this._obj.getChildCount(query);
  }

  async hasChild(path) {
    return this._obj.hasChild(path);
  }

  async addChild(type, path, props) {
    await this._obj.addChild(type, path, props);
    return true;
  }

  async deleteChild(path) {
    await this._obj.deleteChild(path);
    return true;
  }

  async delete() {
    let lastDelim = this.path.lastIndexOf("/");
    let parentPath = this.path.substr(0, lastDelim);

    let parent = Api.create(parentPath, this.request, this.response);
    return parent.deleteChild(this.path);
  }


  verifyArgument(name, condition) {
    if (condition === false) {
      throw new InvalidArgumentException(name);
    }

    return true;
  }


  static async create(path, req, res, dbobj) {
    let obj = ObjectBase.create(path);
    await obj.init(dbobj);

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