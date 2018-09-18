#! /usr/bin/env node

const InvalidArgumentException = require("../lib/common/Exception.js").InvalidArgumentException;
const Path = require("../lib/common/Path.js").Path;
const Api = require("../lib/common/Api.js").Api;


class Router {
  
  constructor() {
    this.express = require("express");
    this.app = this.express();
  }


  init() {
    this.app.all("/", function(request, response) {
      response.set("Content-Type", "text/html");
      response.sendFile("views/index.html", { root : __dirname });
    });

    this.app.use(this.express.static("public"));

    this.app.all("/api/*", function(req, res) {

    });
  }


  __callApi(path, action, args, callback) {
  }

  
  static __parseUrl(path) {
    let result = { url : path };

    let components = path.split("/"); // example: ["", "api", "scheme", "type", "path1".."pathn", "action"]
    if (components.length < 6 || components[0] !== "") {
      throw new InvalidArgumentException("path");
    }

    result.urltype = components[1];
    result.scheme = components[2];
    result.type = components[3];
    result.name = components[4];
    result.action = components[5];

    return result;
  }


  static __parseArguments(req) {
    let args = Object.assign({}, req.cookies, req.query);

    if (req.is("application/json") || req.is("application/x-www-form-urlencoded")) {
      args = Object.assign(args, req.body);
    }

    return args;
  }
}