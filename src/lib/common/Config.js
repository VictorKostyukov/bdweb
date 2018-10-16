#! /usr/bin/env node

const Config = {
 
  confDir : `${__dirname}/../../config`,
  sharedKey : null,
  kademliaUrl : null,
  kademliaTimeout : 10000,
  port : 8080,
  contractProvider : null,
  tokenSymbol : "DRV",
  tokenPrecision : 2,
  contractConnectTimeout : 10000,
  contractActionTimeout : 300000,
  issueTestTokens : 1000,
  

  init : function() {
    this.__initSharedKey();
    this.__initAppConfig();

    console.log(`kademliaUrl=${this.kademliaUrl}`);
    console.log(`contractProvider=${this.contractProvider}`);
    console.log(`port=${this.port}`);
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
      mkdirp(this.confDir, err => {
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
      if (obj.ContractProvider) {
        this.contractProvider = obj.ContractProvider;
      }
      if (obj.Port) {
        this.port = obj.Port;
      }
      if (obj.TokenSymbol) {
        this.tokenSymbol = obj.TokenSymbol;
      }
      if (typeof(obj.TokenPrecision) !== "undefined") {
        this.tokenPrecision = obj.TokenPrecision;
      }
      if (typeof(obj.ContractConnectTimeout) !== "undefined") {
        this.contractConnectTimeout = obj.ContractConnectTimeout;
      }
      if (typeof(obj.ContractActionTimeout) !== "undefined") {
        this.contractActionTimeout = obj.ContractActionTimeout;
      }
      if (typeof(obj.IssueTestTokens) !== "undefined") {
        this.issueTestTokens = obj.IssueTestTokens;
      }
    } catch (ex) {
      console.log("bdweb.conf not found. Using default configurations.");
    }

    if (!this.kademliaUrl) {
      this.kademliaUrl = "http://18.236.152.176:7800";
    }

    if (!this.contractProvider) {
      this.contractProvider = "http://180.167.212.6:7810";
    }
  }

};



module.exports = {
  Config : Config
};