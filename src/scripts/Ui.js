const UI = {

  _defaultUrl : "/#/view/system/Home/",

  location : {},

  init : function() {
    $(window).on("hashchange", e => UI.__onHashChanged(location.hash)).trigger("hashchange");
  },


  render : function() {
    $.ajax({url : UI.location.viewUrl + UI.location.action})
      .done(function(obj) {
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
  }
};


UI.init();

module.exports = {
  UI : UI
};