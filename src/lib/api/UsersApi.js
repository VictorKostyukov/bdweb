#! /usr/bin/env node

const Api = require("../common/Api.js").Api;
const Role = require("../common/Security.js").Role;
const Transaction = require("../common/Transaction.js").Transaction;


class UsersApi extends Api {
  constructor(obj) {
    super(obj);
  }


  static get index() {
    return [
      "Path",
      "Properties.Username",
      "Properties.Role",
      "Properties.Account"
    ];
  }


  async NewUser(username, password) {
    this.security.verify(this, "adminPlus");
    return this.newUser(username, password);
  }


  async newUser(username, password) {
    this.verifyArgument("username", typeof(username) === "string" && username.length > 0);
    this.verifyArgument("password", typeof(password) === "string" && password.length > 0);

    username = username.toLowerCase();

    let path = this.path + "/" + username;
    let props = {
      Username : username,
      Role : Role.user,
      Owner : path
    };

    let api;
    let transaction = Transaction.begin();

    try
    {
      await this.addChild("User", path, props);

      api = await Api.create(path, this.request, this.response);
      await api.setPassword(password);
      await api.createAccount();

      await transaction.commit();
    } catch(ex) {
      await transaction.abort();
      throw ex;
    }

    if (this.security.role === Role.anonymouse) {
      this.security.user = api;
      this.response.cookie("st", this.security.getSecurityToken());
    }

    return api;
  }
}


module.exports = {
  UsersApi : UsersApi
}
