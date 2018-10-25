#! /usr/bin/env node

const View = require("../common/View.js").View;
const NotSupportedException = require("../common/Exception.js").NotSupportedException;
const Config = require("../common/Config.js").Config;

class SystemSecurityView extends View {
  constructor(api) {
    super(api);
  }


  async model() {
    throw new NotSupportedException();
  }


  async SignUp() {
    return this.__render({
      view : {
        navigationBar : { hidden : true },
        noContainer : true
      }
    }, "TITLE_SignUp");
  }


  async Login() {
    return this.__render({
      view : {
        navigationBar : { hidden : true },
        noContainer : true
      },
      eosTimeout : Config.contractConnectTimeout + Config.contractActionTimeout
    }, "TITLE_SignIn");
  }
}


module.exports = {
  SystemSecurityView : SystemSecurityView
};
