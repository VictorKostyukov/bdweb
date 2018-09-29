#! /usr/bin/env node

const Web3 = require("web3");
const Config = require("./Config.js").Config;


class Ethereum {
  constructor() {
    this._web3 = new Web3();
  }


  init() {
    this._web3.setProvider(Config.web3Provider);
  }

  get web3() {
    return this._web3;
  }
}


const ethereum = new Ethereum();

module.exports = {
  ethereum : ethereum
};