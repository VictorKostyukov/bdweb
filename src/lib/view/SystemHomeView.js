const View = require("../common/View.js").View;
const Api = require("../common/Api.js").Api;
const Config = require("../common/Config.js").Config;

class SystemHomeView extends View {
  constructor(api) {
    super(api);
  }


  async model() {
    this.security.verify(this.api, "userPlus");

    let result = {
      page : "Home",
      user : this.security.user.path
    }

    try {
      let user = await Api.create(this.security.user.path, this.request, this.response);
      result.account = user.getAccount();
      result.tokenSymbol = Config.tokenSymbol;
      result.tokenPrecision = Config.tokenPrecision;
      result.issueTestTokens = user.canIssueTestTokens();
      if (result.issueTestTokens) {
        result.issueTestTokenLimit = Config.issueTestTokens;
      }
      result.contractTimeout = Config.contractConnectTimeout + Config.contractActionTimeout;
    } catch (ex) {
    }

    return this.__render(result, "TITLE_Home", "Home");
  }
}


module.exports = {
  SystemHomeView : SystemHomeView
};