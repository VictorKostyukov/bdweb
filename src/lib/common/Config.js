#! /usr/bin/env node

const Config = {
 
  confDir : `${__dirname}/../../config`,
  sharedKey : null,
  kademliaUrl : null,
  kademliaTimeout : 10000,
  web3Provider : null,

  init : function() {
    this.__initSharedKey();
    this.__initAppConfig();

    console.log(`kademliaUrl=${this.kademliaUrl}`);
    console.log(`web3Provider=${this.web3Provider}`);
  },


  __initSharedKey : function() {
    const fs = require("fs");
    let filename = this.confDir + "/SharedKey.conf";
    try {
      this.sharedKey = new Buffer(fs.readFileSync(filename, "utf8"), "hex");
    } catch(ex) {
      const crypto = require("crypto");
      this.sharedKey = crypto.randomBytes(16);

      const mkdirp = require("mkdirp");
      mkdirp(this.confDir, function(err) {
        try {
          fs.writeFileSync(filename, this.sharedKey.toString("hex"));
        } catch (ex2) {
          console.error(ex2);
        }
      })
    }
  },


  __initAppConfig : function() {
    const fs = require("fs");
    let filename = this.confDir + "/bdweb.conf";
    try {
      let content = fs.readFileSync(filename, "utf8");
      let obj = JSON.parse(content);
      if (obj.Kademlia) {
        this.kademliaUrl = obj.Kademlia;
      }
      if (typeof(obj.KademliaTimeout) !== "undefined") {
        this.kademliaTimeout = obj.KademliaTimeout;
      }
      if (obj.Web3) {
        this.web3Provider = obj.Web3;
      }
    } catch (ex) {
      console.error(ex);
    }

    if (!this.kademliaUrl) {
      this.kademliaUrl = "http://18.236.152.176:7800";
    }

    if (!this.web3Provider) {
      this.web3Provider = "http://180.167.212.6:8545";
    }
  }

};



module.exports = {
  Config : Config
};