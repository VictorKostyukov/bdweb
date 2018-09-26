const View = require("../common/View.js").View;


class SystemHomeView extends View {
  constructor(api) {
    super(api);
  }


  model() {
    this.api.security.verify(this.api, "userPlus");
    return this.__render("hello world", "TITLE_Home");
  }
}


module.exports = {
  SystemHomeView : SystemHomeView
};