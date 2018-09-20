#! /usr/bin/env node

const Api = require("../common/Api.js").Api;


class SystemHomeApi extends Api {
  constructor(obj) {
    super(obj);
  }

  async Test({test1, test2}) {
    return {
      test1: test1,
      test2: test2
    };
  }
}


module.exports = {
  SystemHomeApi : SystemHomeApi
};