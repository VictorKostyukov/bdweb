#! /usr/bin/env node

const InvalidArgumentException = require("Exception.js").InvalidArgumentException;

class Path {

  constructor(str) {
    this.scheme = null;
    this.path = null;
    this.name = null;

    this.__init(str);
  }

  get scheme() {
    return this.scheme;
  }

  get path() {
    return this.path;
  }

  get name() {
    return this.name;
  }

  __init(str) {
    if (!str) {
      throw new InvalidArgumentException("str");
    }

    if (str.endsWith("/")) {
      str = str.substr(0, str.length - 1);
    }

    let delim = str.indexOf("://");
    if (delim <= 0) {
      throw new InvalidArgumentException("str");
    }

    this.scheme = str.substr(0, delim);
    if (this.scheme !== "name" && this.scheme !== "system") {
      throw new InvalidArgumentException("str");
    }

    this.path = str;
    if (delim < str.length - 3) {
      this.name = str.substr(str.lastIndexOf("/"));
    } else {
      this.name = "";
    }
  }
}

module.exports = {
  Path : Path
};