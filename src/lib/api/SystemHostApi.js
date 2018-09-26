#! /usr/bin/env node

const Api = require("../common/Api.js").Api;


class SystemHostApi extends Api {
  constructor(obj) {
    super(obj);
  }


  async GetHosts() {
    this.security.verify(this, "userPlus");

    let hosts = await Api.create("name://Hosts", this.request, this.response);
    return hosts.getChildren({ "Properties.Owner" : this.security.user.path });
  }


  async GetHostCount() {
    this.security.verify(this, "userPlus");

    let hosts = await Api.create("name://Hosts", this.request, this.response);
    return hosts.getChildCount({ "Properties.Owner" : this.security.user.path }); 
  }


  async RegisterHost(id) {
    this.security.verify(this, "userPlus");

    let hosts = await Api.create("name://Hosts", this.request, this.response);
    return hosts.newHost(id, this.security.user.path);
  }
}


module.exports = {
  SystemHostApi : SystemHostApi
}
