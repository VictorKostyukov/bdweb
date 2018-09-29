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
    this.security.verify(this, "anonymouse");

    let api = await Api.create("name://Users", this.request, this.response);
    return api.newUser(username, password);
  }


  async LoginPassword(username, password) {
    this.verifyArgument("username", typeof(username) === "string" && username.length > 0);
    this.verifyArgument("password", typeof(password) === "string" && password.length > 0);

    let api = await Api.create(`name://Users/${username.toLowerCase()}`, this.request, this.response);
    return api.LoginPassword(password);
  }
}


module.exports = {
  SystemSecurityApi : SystemSecurityApi
}