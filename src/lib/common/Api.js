#! /usr/bin/env node

const NotSupportedException = require("Exception.js").NotSupportedException;
const ObjectBase = require("Object.js").ObjectBase;


class Api {
  constructor(obj) {
    this.obj = obj;
  }

  get type() {
    return this.obj.type;
  }

  get path() {
    return this.obj.path;
  }

  get __properties() {
    return this.obj.properties ? this.obj.properties : {};
  }

  __getProperty(key) {
    return this.obj.getProperty ? this.obj.getProperty(key) : undefined;
  }

  __hasProperty(key) {
    return this.obj.hasProperty ? this.obj.hasProperty(key) : false;
  }

  __setProperty(key, val, oncomplete) {
    if (this.obj.setProperty){
      this.obj.setProperty(key, val, oncomplete);
    } else {
      throw new NotSupportedException();
    }
  }

  ///////////////

  __setProperties(props, oncomplete) {
    this.obj.setProperties(props, oncomplete);
  }


  static create(path, onload) {
    ObjectBase.create(path, function(obj) {
      const apiType = require("../api/" + obj.type + "Api.js")[obj.type + "Api"];
      if (onload) {
        onload(new apiType(obj));
      }
    });
  }
}


module.exports = {
  Api : Api
};