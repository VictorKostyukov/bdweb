#! /usr/bin/env node

const Api = require("../common/Api.js").Api;
const LoginExpiredException = require("../common/Exception.js").LoginExpiredException;
const AccessDeniedException = require("../common/Exception.js").AccessDeniedException;


class SystemSecurityApi extends Api {
  constructor(obj) {
    super(obj);
  }


  async GetUser() {
    throw new LoginExpiredException();
  }


  async RegisterUser({username, password}) {
    return true;
  }
}


module.exports = {
  SystemSecurityApi : SystemSecurityApi
}