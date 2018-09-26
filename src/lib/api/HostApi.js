#! /usr/bin/env node

const Api = require("../common/Api.js").Api;


class HostApi extends Api {
  constructor(obj) {
    super(obj);
  }


  async GetId() {
    this.security.verify(this, "ownerPlus");
    return this.getId();
  }


  async GetAddress() {
    this.security.verify(this, "ownerPlus");
    return this.getProperty("Address");
  }


  async GetAvailableSpace() {
    this.security.verify(this, "ownerPlus");
    return this.getProperty("AvailableSpace");
  }


  async GetTotalSpace() {
    this.security.verify(this, "ownerPlus");
    return this.getProperty("TotalSpace");
  }


  async GetLastUpdateTime() {
    this.security.verify(this, "ownerPlus");
    return this.getProperty("LastUpdateTime");
  }

  async GetProperties() {
    this.security.verify(this, "ownerPlus");

    return {
      Id : this.getId(),
      Address : this.getProperty("Address"),
      AvailableSpace : this.getProperty("AvailableSpace"),
      TotalSpace : this.getProperty("TotalSpace"),
      LastUpdateTime : this.getProperty("LastUpdateTime")
    };
  }


  getId() {
    return this.path.substr(this.path.lastIndexOf("/") + 1);
  }


  async setAddress(address) {
    let props = {
      Address : this.setProperty("Address", address),
      LastUpdateTime : Math.floor(new Date() / 1000)
    };

    return this.setProperties(props);
  }


  async setSpace(availableSpace, totalSpace) {
    let props = {
      AvailableSpace : availableSpace,
      TotalSpace : totalSpace,
      LastUpdateTime : Math.floor(new Date() / 1000)
    };
    
    return this.setProperties(props);
  }


  async setLastUpdateTime(ts) {
    return this.setProperty("LastUpdateTime", ts);
  }
}


module.exports = {
  HostApi : HostApi
}
