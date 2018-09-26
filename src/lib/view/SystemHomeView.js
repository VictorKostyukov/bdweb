const View = require("../common/View.js").View;


class SystemHomeView extends View {
  constructor(api) {
    super(api);
  }


  async model() {
    this.security.verify(this.api, "userPlus");
    return this.__render({
      page : "Home",
      message : "Home"
    }, "TITLE_Home");
  }


  async Hosts() {
    this.security.verify(this.api, "userPlus");
    return this.__render({
      page : "Hosts",
      message : "Hosts"
    }, "TITLE_Hosts");
  }


  async Clients() {
    this.security.verify(this.api, "userPlus");
    return this.__render({
      page : "Clients",
      message : "Clients"
    }, "TITLE_Clients");
  }


  async Contracts() {
    this.security.verify(this.api, "userPlus");
    return this.__render({
      page : "Contracts",
      message : "Contracts"
    }, "TITLE_Contracts");
  }
}


module.exports = {
  SystemHomeView : SystemHomeView
};