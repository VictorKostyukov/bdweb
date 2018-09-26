#! /usr/bin/env node

const Api = require("../common/Api.js").Api;


class HostsApi extends Api {
  constructor(obj) {
    super(obj);
  }


  static get index() {
    return [
      "Path",
      "Properties.Address",
      "Properties.Owner"
    ];
  }


  async NewHost(id) {
    this.security.verify(this, "userPlus");

    return this.newHost(id, this.security.user.path);
  }


  async GetHosts(query, offset, limit) {
    //this.security.verify(this, "adminPlus");

    return this.getChildren(query, offset, limit);
  }


  async GetHostCount(query) {
    // this.security.verify(this, "adminPlus");

    return this.getChildCount(query);
  }


  async newHost(id, owner) {
    this.verifyArgument("id", typeof(id) === "string" && id.length > 0);

    let path = `name://Hosts/${id}`;
    let props = {
      Owner : owner
    };

    await this.addChild("Host", path, props);
    return { Type : "Host", Path : path };
  }
}


module.exports = {
  HostsApi : HostsApi
}
