#! /usr/bin/env node

const View = require("../common/View.js").View;


class SystemHostView extends View {
  constructor(api) {
    super(api);
  }


  async model() {
    this.security.verify(this.api, "userPlus");

    let hosts = await this.api.GetHosts();
    let hostArr = [];

    for (let i = 0; i < hosts.length; ++i) {
      let props = await hosts[i].GetProperties();
      hostArr.push({
        Type : "Host",
        Path : hosts[i].path,
        Properties : props
      });
    }

    return this.__render({ action : "default", hosts : hostArr }, "TITLE_Hosts", "Hosts");
  }


  async Register() {
    this.security.verify(this.api, "userPlus");

    return this.__render({ action : "register" }, "TITLE_Hosts_Register", "Hosts");
  }
}


module.exports = {
  SystemHostView : SystemHostView
};
