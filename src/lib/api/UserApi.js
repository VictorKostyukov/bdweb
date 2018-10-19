#! /usr/bin/env node

const Api = require("../common/Api.js").Api;
const PasswordCredential = require("../common/Credential.js").PasswordCredential;
const _exceptions = require("../common/Exception.js");
const InvalidArgumentException = _exceptions.InvalidArgumentException;
const InvalidCredentialException = _exceptions.InvalidCredentialException;
const AlreadyExistException = _exceptions.AlreadyExistException;
const InvalidOperationException = _exceptions.InvalidOperationException;
const NotSupportedException = _exceptions.NotSupportedException;
const Config = require("../common/Config.js").Config;
const SecureString = require("../common/SecureString.js");
const sc = require("../common/ContractProvider.js");

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

    if (this.getProperty("AccountStatus")) {
      throw new AlreadyExistException();
    }

    return await this.createAccount(password);
  }


  async GetBalance() {
    this.security.verify(this, "owner");

    let account = this.getAccount();
    if (!account) {
      throw new InvalidOperationException("No wallet account is associated with this user.");
    }

    return await sc.getBalance(this.getProperty("Account"));
  }


  async IssueTestTokens() {
    this.security.verify(this, "owner");

    if (!this.canIssueTestTokens()) {
      throw new NotSupportedException();
    }

    let account = this.getAccount();
    if (!account) {
      throw new InvalidOperationException("No wallet account is associated with this user.");
    }

    let rtn = await sc.issueTokens(account, Config.issueTestTokens);
    this.setProperty("TestTokensIssued", true);
    return rtn;
  }


  async TransferTokens(account, amount, password) {
    this.security.verify(this, "owner");

    if (!amount || amount <= 0) {
      throw new InvalidArgumentException("amount");
    }

    let from = this.getAccount();
    if (!account) {
      throw new InvalidOperationException("No wallet account is associated with this user.");
    }

    let to = account;
    if (account.startsWith("@")) {
      let username = account.substr(1);
      let user = await Api.create(`name://Users/${username}`, this.request, this.response);
      to = user.getAccount();
      if (!to) {
        throw new InvalidOperationException("No wallet account is associated with the target user.");
      }
    }

    let accountPassword = this.getAccountPassword();

    return await sc.transferTokens(from, to, amount, accountPassword.getRawData(password));
  }



  async setPassword(password) {
    if (!password || password.length < 1) {
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
    await this.setProperty("AccountStatus", "creating");

    try {
      let accountObj = await sc.newAccount();
      let accountPassword = new SecureString();
      await accountPassword.setRawData(accountObj.password, password);

      await this.setProperty("AccountPassword", accountPassword.toJSON());
      await this.setProperty("Account", accountObj.name);
      await this.setProperty("AccountStatus", "created");

      return {
        Name : accountObj.name,
        OwnerKey : accountObj.owner
      };
    } catch (ex) {
      await this.setProperty("AccountStatus", undefined);
    }
  }


  getAccount() {
    return this.getProperty("Account");
  }


  getAccountPassword() {
    let accountPassword = this.getProperty("AccountPassword");
    if (accountPassword) {
      let result = new SecureString();
      result.fromJSON(accountPassword);
      return result;
    }

    return null;
  }


  canIssueTestTokens() {
    return Config.issueTestTokens && !this.getProperty("TestTokensIssued");
  }
}


module.exports = {
  UserApi : UserApi
};
