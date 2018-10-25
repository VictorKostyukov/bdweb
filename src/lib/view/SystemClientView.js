#! /usr/bin/env node

const View = require("../common/View.js").View;


class SystemClientView extends View {
  constructor(api) {
    super(api);
  }


  async model() {
    this.security.verify(this.api, "userPlus");

    let result = {
      clients : []
    };

    return this.__render(result, "TITLE_Clients", "Clients");
  }
}


module.exports = {
  SystemClientView : SystemClientView
};