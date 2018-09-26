const Resources_default = require("./localization/Resources.js");

const UI = {

  _defaultUrl : "/#/view/system/Home/",
  _locale : null,

  location : {},

  init : function() {
    UI.setLocale("en-US");

    let errorHandler = event => UI.handleError(event.reason);
    window.addEventListener("unhandledrejection", errorHandler);
    if (!"onunhanbledreject" in window) {
      window.onunhanbledreject = errorHandler;
    }

    window.onerror = (msg, url, line, col, err) => UI.handleError(err);
    $(window).on("hashchange", e => UI.__onHashChanged(location.hash)).trigger("hashchange");
  },


  render : function() {
    $.ajax({url : UI.location.viewUrl + UI.location.action})
      .done(function(obj) {
        ReactDOM.render(null, document.getElementById("main"));

        if (obj.Type === "Error") {
          throw obj;
        }

        if (obj.Title) {
          document.title = obj.Title ? UI.loc(obj.Title) : UI.loc("Drive User Portal");
        }

        let viewName = obj.Type + "View";
        let view = require("./views/" + viewName + ".jsx");
        ReactDOM.render(
          React.createElement(view[viewName], { path : obj.Path, type : obj.Type, model : obj.Model, location : UI.location }),
          document.getElementById("main")
        );
      })
      .fail(function(jqXHR, status, err) {
        throw err;
      });
  },


  __onHashChanged : function(hash) {
    UI.location = {};

    const prefix = "#/view/";
    if (!hash || hash == "#/" || !hash.startsWith(prefix)) {
      window.location = UI._defaultUrl;
      return false;
    }

    let end = hash.indexOf("?");
    if (end < 0) {
      end = hash.length;
    }

    let components = hash.substr(prefix.length, end - prefix.length).split("/");
    if (components.length < 3) {
      window.location = UI._defaultUrl;
      return false;
    }

    let path = components[0] + ":/";
    let tmpUrl = components[0] + "/";
    for (let i = 1; i < components.length - 1; ++i) {
      path += "/" + components[i];
      tmpUrl += components[i] + "/";
    }

    let action = components[components.length - 1];
    let apiUrl = "/api/" + tmpUrl;
    let viewUrl = "/view/" + tmpUrl;

    UI.location = {
      path : path,
      apiUrl : apiUrl,
      viewUrl : viewUrl,
      action : action
    };

    UI.render();
  },


  getLocale : function() {
    if (!UI._locale || !UI._locale.name) {
      return "en-US";
    }
    return UI._locale.name;
  },


  setLocale : function(val) {
    let resources = Resources_default;
    if (val && val != "en-US") {
      const filename = `Resources.${val}`;
      resources = require("./localization/" + filename + ".js");
    }

    UI._locale = {
      name : val,
      resources : resources
    };
  },


  loc : function(key) {
    if (UI._locale && UI._locale.resources && key in UI._locale.resources) {
      return UI._locale.resources[key];
    } else if (key in Resources_default) {
      return Resources_default[key];
    } else {
      console.warn(`[LOCALIZATION] Resource not localized: ${key}`);
      return key;
    }
  },


  redirect : function(url) {
    window.location = url;
  },


  handleError : function(err) {
    console.log(err);

    if (typeof(err) === "string") {
      alert(err);
    } else if (err.Type === "Error") {
      if (err.Code === 201 || err.Code === 202) { // LOGIN_EXPIRED || ACCESS_DENIED
        UI.cookie.remove("st");
        UI.redirect("/#/view/system/Security/Login");
      } else {
        alert(err.Message);
      }
    } else if (err.message) {
      alert(err.message);
    }
  },


  cookie : {
    get : function(name) {
      let i,x,y;
      let ARRcookies=document.cookie.split(";");

      for (i=0;i<ARRcookies.length;i++)
      {
        x=ARRcookies[i].substr(0,ARRcookies[i].indexOf("="));
        y=ARRcookies[i].substr(ARRcookies[i].indexOf("=")+1);
        x=x.replace(/^\s+|\s+$/g,"");
        if (x==name)
        {
          return unescape(y);
        }
      }
    },
    set : function(name, value) {
      document.cookie = name + "=" + value + ";Path=/";
    },
    remove : function(name) {
      document.cookie = name + "=; Path=/; Expires=Thu, 01 Jan 1970 00:00:01 GMT;";
    }
  }
};


UI.init();

module.exports = {
  UI : UI
};