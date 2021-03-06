#! /usr/bin/env node

const InvalidArgumentException = require("./lib/common/Exception.js").InvalidArgumentException;
const NotSupportedException = require("./lib/common/Exception.js").NotSupportedException;
const Api = require("./lib/common/Api.js").Api;
const View = require("./lib/common/View.js").View;
const ObjectBase = require("./lib/common/Object.js").ObjectBase;
const Security = require("./lib/common/Security.js").Security;
const ApiParser = require("./lib/common/ApiParser.js").ApiParser;


class Router {
  
  constructor() {
    this.express = require("express");
    this.app = this.express();
    this.apiParser = new ApiParser();
  }


  init() {
    this.apiParser.init();

    this.app.all("/", function(request, response) {
      response.set("Content-Type", "text/html");
      response.sendFile("frame/index.html", { root : __dirname });
    });

    this.app.use(this.express.static("public"));

    let bodyParser = require("body-parser");
    this.app.use(bodyParser.json());
    this.app.use(bodyParser.urlencoded({ extended : true }));

    let cookieParser = require("cookie-parser");
    this.app.use(cookieParser());

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

        let worker = async function() {
          let security = new Security();
          if (args.st) {
            let expires = await security.parseSecurityToken(args.st);
            if (security.shouldRenewSecurityToken(expires)) {
              let token = security.getSecurityToken();
              res.cookie("st", token);
            }
          }

          req.security = security;

          let result = await func(uri.path, uri.action, args, req, res);
          if (!res.__customOutput) {
            res.json(Router.__normalizeResult(result));
          }
          return true;
        };

        worker().catch(handleError);
      } catch(ex) {
        handleError(ex);
      }
    };

    this.app.all("/api/*", function(req, res) { handler(_this.__callApi, req, res); });
    this.app.all("/view/*", function(req, res) { handler(_this.__callView, req, res); });
  }


  static __normalizeResult(result) {
    if (result instanceof Api || result instanceof ObjectBase) {
      return { Type : result.type, Path : result.path };
    } else {
      return result;
    }
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

      let declArgs = this.apiParser.getParameterList(api.constructor.name, action);
      let arglist = [];
      if (declArgs) {
        declArgs.forEach(function(name) {
          arglist.push(args[name]);
        });
      }

      return await func.apply(api, arglist);
    } else {
      return {
        Path : api.path,
        Type : api.type
      };
    }
  }


  async __callView(path, action, args, request, response) {
    let view = await View.create(path, request, response);

    let func;
    if (action && action !== "") {
      func = view[action];
    } else {
      func = view.model;
    }

    if (!func) {
      throw new NotSupportedException();
    }

    let declArgs = this.apiParser.getParameterList(view.constructor.name, action);
    let arglist = [];
    if (declArgs) {
      declArgs.forEach(function(name) {
        arglist.push(args[name]);
      });
    }

    return func.apply(view, arglist);
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
    let normalize = function(obj) {
      let result = {};
      for (let name in obj) {
        try {
          result[name] = JSON.parse(obj[name]);
        } catch (ex) {
          result[name] = obj[name];
        }
      }
      return result;
    };

    let args = Object.assign({}, req.cookies, req.query);

    if (req.is("application/x-www-form-urlencoded")) {
      args = normalize(Object.assign(args, req.body));
    } else if (req.is("application/json")) {
      args = Object.assign(normalize(args), req.body);
    } else {
      args = normalize(args);
    }

    return args;
  }
}


module.exports = {
  Router : Router
};