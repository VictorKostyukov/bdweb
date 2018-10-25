#! /usr/bin/env node

const Api = require("../common/Api.js").Api;


class SystemClientApi extends Api {
  constructor(obj) {
    super(obj);
  }
}


module.exports = {
  SystemClientApi : SystemClientApi
};
