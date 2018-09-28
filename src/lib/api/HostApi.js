#! /usr/bin/env node

const Api = require("../common/Api.js").Api;
const Config = require("../common/Config.js").Config;
const RemoteCall = require("../common/RemoteCall.js").RemoteCall;
const OperationTimeoutException = require("../common/Exception.js").OperationTimeoutException;


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


  async GetRelays() {
    this.security.verify(this, "ownerPlus");
    return this.getProperty("Relays");
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
      Relays : this.getProperty("Relays"),
      AvailableSpace : this.getProperty("AvailableSpace"),
      TotalSpace : this.getProperty("TotalSpace"),
      LastUpdateTime : this.getProperty("LastUpdateTime")
    };
  }

  async UpdateProperties() {
    this.security.verify(this, "ownerPlus");

    await this.updateAddress();
    await this.updateSpace();
    return true;
  }


  getId() {
    return this.path.substr(this.path.lastIndexOf("/") + 1);
  }


  async setAddress(address, relays) {
    let props = {
      Address : address,
      Relays : relays,
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


  async updateAddress() {
    let id = this.getId();
    let key = encodeURIComponent(`ep:${id}`);

    let remote = new RemoteCall(`${Config.kademliaUrl}/api/host/Kademlia/GetValue?key=${key}`);
    remote.timeout = Config.kademliaTimeout;
    let value = await remote.invoke();
    let result = JSON.parse(new Buffer(value, "base64").toString("utf8"));
    return this.setAddress(result.url, result.relays);
  }


  async updateSpace() {
    let address = this.getProperty("Address");
    if (!address) {
      return false;
    }

    let relays = this.getProperty("Relays");
    let success = false;
    let result;

    if (!relays || relays.length === 0) {
      let remote = new RemoteCall(`${address}/api/host/Config/GetStatistics`);
      result = await remote.invoke();
      success = true;
    } else {
      const url = require("url");
      let addr = url.parse(address);
      address = `${addr.protocol}//${this.getId()}:${addr.port}`;
      let remote = new RemoteCall(`${address}/api/host/Config/GetStatistics`);
      for (let i = 0; !success && i < relays.length; ++i) {
        if (!relays[i].endpoints || relays[i].endpoints.length === 0) {
          continue;
        }

        for (let j = 0; !success && j < relays[i].endpoints.length; ++j) {
          remote.setRelay(relays[i].endpoints[j].host, relays[i].endpoints[j].socks);
          try {
            result = await remote.invoke();
            success = true;
          } catch (ex) {
          }
        }
      }
    }

    if (!success) {
      throw new OperationTimeoutException();
    }

    return this.setSpace(result.AvailableSize, result.TotalSize);
  }
}


module.exports = {
  HostApi : HostApi
}
