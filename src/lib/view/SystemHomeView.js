const View = require("../common/View.js").View;
const Api = require("../common/Api.js").Api;


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
      let user = Api.create(this.security.user.path);
      let balance = await user.GetBalance();
      result.balance = balance;
    } catch (ex) {
    }

    return this.__render(result, "TITLE_Home");
  }
}


module.exports = {
  SystemHomeView : SystemHomeView
};