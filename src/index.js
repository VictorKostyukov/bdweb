#! /usr/bin/env node

const Config = require("./lib/common/Config.js").Config;
const db = require("./lib/common/DbConnection.js").connection;
const Router = require("./Router.js").Router;
const ethereum = require("./lib/common/Ethereum.js").ethereum;

async function main() {
  Config.init();

  await db.init("bdtest");
  
  let router = new Router();
  router.init();

  ethereum.init();

  return await router.run(Config.port);
}


main().then(() => console.log("Server started."));