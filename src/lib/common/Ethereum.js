#! /usr/bin/env node

const Web3 = require("web3-cmt");
const Config = require("./Config.js").Config;


class Ethereum {
  constructor() {
    this._web3 = new Web3();
  }


  init() {
    this._web3.setProvider(new this._web3.providers.HttpProvider(Config.web3Provider));
  }

  get web3() {
    return this._web3;
  }
}


const ethereum = new Ethereum();

module.exports = {
  ethereum : ethereum
};