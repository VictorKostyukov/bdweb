const View = require("../common/View.js").View;


class SystemTestView extends View {
  constructor(api) {
    super(api);
  }


  model() {
    return this.__render("hello world");
  }
}


module.exports = {
  SystemTestView : SystemTestView
};