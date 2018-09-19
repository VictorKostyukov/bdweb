#! /usr/bin/env node

const db = require("./lib/common/DbConnection.js").connection;
const Router = require("./main/Router.js").Router;

async function main() {
  await db.init("bdtest");
  
  let router = new Router();
  router.init();

  return await router.run(8080);
}


main().then(() => console.log("Server started."));