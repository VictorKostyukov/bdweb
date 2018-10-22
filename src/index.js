#! /usr/bin/env node

const Config = require("./lib/common/Config.js").Config;
const db = require("./lib/common/DbConnection.js").connection;
const Router = require("./Router.js").Router;

async function main() {
  Config.init();

  await db.init("bdweb");
  
  let router = new Router();
  router.init();

  return await router.run(Config.port);
}


main().then(() => console.log("Server started."));