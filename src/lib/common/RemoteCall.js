#! /usr/bin/env node

const request = require("request");
const Agent = require("socks5-http-client/lib/Agent");
const _exception = require("../common/Exception.js");
const OperationTimeoutException = _exception.OperationTimeoutException;
const InvalidResponseException = _exception.InvalidResponseException;


class RemoteCall {
  constructor(url, args) {
    this._url = url;
    this._args = args;
    this._timeout = 5000;
    this._relayHost = null;
    this._relayPort = 0;
  }

  get url() { 
    return this._url;
  }

  set url(val) {
    this._url = val;
  }

  get args() {
    return this._args;
  }

  set args(val) {
    this._args = val;
  }

  get timeout() {
    return this._timeout;
  }

  set timeout(val) {
    this._timeout = val;
  }

  get relayHost() {
    return this._relayHost;
  }

  get relayPort() {
    return this._relayPort;
  }

  setRelay(host, port) {
    this._relayHost = host;
    this._relayPort = port;
  }


  async invoke() {
    let options = {
      url : this.url,
      timeout : this.timeout
    };

    if (this.args) {
      options.method = "POST";
      options.json = this.args;
    }

    if (this.relayHost && this.relayPort) {
      options.agentClass = Agent;
      options.agentOptions = {
        socksHost : this.relayHost,
        socksPort : this.relayPort
      };
    }

    return new Promise((resolve, reject) => {
      request(options, function(err, res, body) {
        if (err) {
          console.error(err);
          if (err.code === "ETIMEDOUT") {
            reject(new OperationTimeoutException());
          } else {
            reject(new InvalidResponseException());
          }
        } else if (res.statusCode !== 200) {
          reject(new InvalidResponseException());
        } else {
          let data = body;
          try {
            data = JSON.parse(data);
          } catch (ex) {
          }

          resolve(data);
        }
      });
    });
  }
}


module.exports = {
  RemoteCall : RemoteCall
};