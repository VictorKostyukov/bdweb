#! /usr/bin/env node

const InvalidArgumentException = require("./lib/common/Exception.js").InvalidArgumentException;
const NotSupportedException = require("./lib/common/Exception.js").NotSupportedException;
const Api = require("./lib/common/Api.js").Api;
const View = require("./lib/common/View.js").View;


class Router {
  
  constructor() {
    this.express = require("express");
    this.app = this.express();
  }


  init() {
    this.app.all("/", function(request, response) {
      response.set("Content-Type", "text/html");
      response.sendFile("frame/index.html", { root : __dirname });
    });

    this.app.use(this.express.static("public"));

    let _this = this;

    let handler = function(method, req, res) {
      let handleError = ex => {
        res.json({
          Type : "Error",
          Code : ex.code ? ex.code : 1,
          Message : ex.message
        });
      };

      try {
        let uri = Router.__parseUrl(req.path);
        let args = Router.__parseArguments(req);
        let func = method.bind(_this);

        func(uri.path, uri.action, args, res)
          .then(result => {
            res.json(result);
          })
          .catch(handleError);
      } catch(ex) {
        handleError(ex);
      }
    };

    this.app.all("/api/*", function(req, res) { handler(_this.__callApi, req, res); });
    this.app.all("/view/*", function(req, res) { handler(_this.__callView, req, res); });
  }


  async run(port) {
    return new Promise(resolve => this.app.listen(port, resolve));
  }


  async __callApi(path, action, args, request, response) {
    let api = await Api.create(path, request, response);

    if (action) {
      let func = api[action];
      if (!func) {
        throw new NotSupportedException();
      }

      let method = func.bind(api);
      return await method(args);
    } else {
      return {
        Path : api.path,
        Type : api.type
      };
    }
  }


  async __callView(path, action, args, request, response) {
    let view = await View.create(path, request, response);
    await view.init();

    let func;
    if (action && action !== "") {
      func = view[action];
    } else {
      func = view.model;
    }

    if (!func) {
      throw new NotSupportedException();
    }

    let method = func.bind(view);
    return method(args);
  }


  static __parseUrl(path) {
    let result = { url : path };

    let components = path.split("/"); // example: ["", "api|view", "scheme", "path1".."pathn", "action"]
    if (components.length < 5 || components[0] !== "") {
      throw new InvalidArgumentException("path");
    }

    result.urltype = components[1];

    result.path = components[2] + ":/";
    for (let i = 3; i < components.length - 1; ++i) {
      result.path += "/" + components[i];
    }

    result.action = components[components.length - 1];

    if (result.action.startsWith("__") || (result.action.length > 0 && result.action[0].toUpperCase() !== result.action[0])) {
      throw new InvalidArgumentException("path");
    }

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


module.exports = {
  Router : Router
};