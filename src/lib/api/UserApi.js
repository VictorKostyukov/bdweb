#! /usr/bin/env node

const Api = require("../common/Api.js").Api;
const PasswordCredential = require("../common/Credential.js").PasswordCredential;
const _exceptions = require("../common/Exception.js");
const InvalidArgumentException = _exceptions.InvalidArgumentException;
const InvalidCredentialException = _exceptions.InvalidCredentialException;
const AlreadyExistException = _exceptions.AlreadyExistException;
const RequirePasswordException = _exceptions.RequirePasswordException;
const InvalidOperationException = _exceptions.InvalidOperationException;
const web3 = require("../common/Ethereum.js").ethereum.web3;
const Cache = require("../common/Cache.js");

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
    let st;
    if (success) {
      this.security.user = this;
      st = this.security.getSecurityToken();
      this.response.cookie("st", st);
    } else {
      throw new InvalidCredentialException();
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


  async GetAccount() {
    this.security.verify(this, "ownerPlus");
    return this.getAccount();
  }


  async CreateAccount(password) {
    this.security.verify(this, "owner");

    if (this.hasProperty("Account")) {
      throw new AlreadyExistException();
    }

    return await this.createAccount(password);
  }


  async UnlockAccount(password, duration) {
    this.security.verify(this, "owner");

    if (!this.hasProperty("Account")) {
      throw new InvalidOperationException("No account is associated with this user.");
    }

    if (!duration || duration < 0) {
      duration = 300 * 1000;
    }

    let name = this.path.substr(this.path.lastIndexOf("/") + 1);
    Cache.putSecure(`user:unlock:${name}`, password, duration);
    return true;
  }


  async GetBalance() {
    this.security.verify(this, "owner");

    await this.assertAccountUnlocked();

    return web3.fromWei(web3.cmt.getBalance(this.getAccount()));
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


  async createAccount(password) {
    let address = await web3.personal.newAccount(password);
    await this.setProperty("Account", address);

    return address;
  }


  getAccount() {
    return this.getProperty("Account");
  }


  async assertAccountUnlocked() {
    let address = this.getAccount();
    if (!address) {
      throw new InvalidOperationException("No account is associated with this user.");
    }

    let name = this.path.substr(this.path.lastIndexOf("/") + 1);
    let key = `user:unlock:${name}`;
    let password = Cache.getSecure(key);
    if (password === null) {
      throw new RequirePasswordException();
    }

    try {
      // TODO: Temporary disable unlockAccount to CMT since this causes OOM exceptions.
      //       Need to find a way to work around this issue.
//      await web3.personal.unlockAccount(address, password);
      Cache.putSecure(key, password, 300*1000);
      console.log(`Account unlocked: ${name}`);
    } catch (ex) {
      console.error("Failed to unlock account for " + name + ": " + ex);
      Cache.del(key);
      throw new RequirePasswordException();
    }

    return true;
  }
}


module.exports = {
  UserApi : UserApi
};
