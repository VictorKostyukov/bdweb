#! /usr/bin/env node

const Api = require("../common/Api.js").Api;


class TestApi extends Api {
  constructor(obj) {
    super(obj);
  }

  Test(test1, test2) {
    return {
      test1: test1,
      test2: test2
    };
  }
}
