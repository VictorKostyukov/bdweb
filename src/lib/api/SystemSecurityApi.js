#! /usr/bin/env node

const Api = require("../common/Api.js").Api;
const LoginExpiredException = require("../common/Exception.js").LoginExpiredException;
const AccessDeniedException = require("../common/Exception.js").AccessDeniedException;
const Role = require("../common/Security.js").Role;


class SystemSecurityApi extends Api {
  constructor(obj) {
    super(obj);
  }


  async GetUser() {
    this.security.verify(this, "userPlus");

    return this.security.user;
  }


  async RegisterUser(username, password) {
    return true;
  }
}


module.exports = {
  SystemSecurityApi : SystemSecurityApi
}