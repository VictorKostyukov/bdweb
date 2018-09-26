#! /usr/bin/env node

const Api = require("../common/Api.js").Api;
const PasswordCredential = require("../common/Credential.js").PasswordCredential;
const InvalidArgumentException = require("../common/Exception.js").InvalidArgumentException;

class UserApi extends Api {
  constructor(obj) {
    super(obj);
  }


  async GetUserName() {
    this.security.verify(this, "ownerPlus");
    return this.getProperty("Username");
  }


  async SetPassword(password) {
    this.security.verify(this, "serverPlus");
    return this.setPassword(password);
  }


  async ChangePassword(oldPassword, newPassword) {
    this.security.verify(this, "ownerPlus");

    let credential = new PasswordCredential();
    credential.password = this.getCredential("Password");
    if (!credential.verify(oldPassword)) {
      throw new InvalidArgumentException("oldPassword");
    }

    return this.setPassword(newPassword);
  }


  async LoginPassword(password) {
    let credential = new PasswordCredential();
    credential.credential = this.getCredential("Password");

    let success = await credential.verify(password);
    let st = this.security.getSecurityToken();
    if (success) {
      this.security.user = this;
      this.response.cookie("st", st);
    }

    return st;
  }


  async GetRole() {
    this.security.verify(this, "ownerPlus");
    return this.getProperty("Role");
  }


  async SetRole(role) {
    this.security.verify({ Role : this.getProperty("Role"), NewRole : role }, "changeRole");
    return this.setProperty("Role", role);
  }


  async setPassword(password) {
    if (!password || password.length < 8) {
      throw new InvalidArgumentException("password");
    }

    let credential = new PasswordCredential();
    credential.password = password;

    await this.setCredential(credential.credential);
    return true;
  }


  async setCredential(val) {
    let credentials = this.getProperty("Credentials");
    if (!credentials) {
      credentials = [];
    }

    let updated = false;
    for (let i = 0; i < credentials.length; ++i) {
      if (credentials[i].Type === val.Type) {
        credentials[i] = val;
        updated = true;
        break;
      }
    }

    if (!updated) {
      credentials.push(val);
    }

    await this.setProperty("Credentials", credentials);
    return credentials;
  }

  
  getCredential(type) {
    let credentials = this.getProperty("Credentials");
    if (credentials) {
      for (let i = 0; i < credentials.length; ++i) {
        if (credentials[i].Type === type) {
          return credentials[i];
        }
      }
    }

    return null;
  }
}


module.exports = {
  UserApi : UserApi
};
