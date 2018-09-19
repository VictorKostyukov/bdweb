const UI = {

  _defaultUrl : "/#/view/system/Home/",

  location : {},

  init : function() {
    $(window).on("hashchange", e => UI.__onHashChanged(location.hash)).trigger("hashchange");
  },


  render : function() {
    let load = async () => {
      let str = await $.ajax({ url : UI.location.apiUrl });
      let obj = JSON.parse(str);

      let view = require("./views/" + obj.Type + "View.js");
      ReactDOM.render(
        React.createElement(view, { api : obj, location : UI.location }),
        document.getElementById("main")
      );
    };
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
    let apiUrl = "/api/" + components[0] + "/";
    for (let i = 1; i < components.length - 1; ++i) {
      path += "/" + components[i];
      apiUrl += components[i] + "/";
    }

    let action = components[components.length - 1];
    UI.location = {
      path : path,
      apiUrl : apiUrl,
      action : action
    };

    UI.render();
  }
};