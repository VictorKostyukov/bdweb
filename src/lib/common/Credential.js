#! /usr/bin/env node

const Crypto = require("crypto")


class Credential {
  constructor() {
    this._credential = null;
  }

  get type() {
    return "";
  }

  get credential() {
    return this._credential;
  }

  set credential(val) {
    this._credential = val;
  }

  async verify(val) {
    return this._credential === val;
  }
}


class PasswordCredential extends Credential {
  constructor() {
    super();
  }

  get type() {
    return "Password";
  }

  set password(val) {
    this.credential = PasswordCredential.getPasswordHash(val);
  }

  async verify(val) {
    if (!this.credential || !this.credential.Salt) {
      return false;
    }

    let target = PasswordCredential.getPasswordHash(val, this.credential.Salt);
    return target.Value === this.credential.Value;
  }

  static getPasswordHash(val, salt) {
    if (!salt) {
      salt = Crypto.randomBytes(128);
    } else {
      salt = Buffer.from(salt, "base64");
    }

    let hash = Crypto.createHmac("sha1", salt);
    hash.update(val);

    return {
      Type : "Password",
      Salt : salt.toString("base64"),
      Value : hash.digest("hex")
    };
  }
}


module.exports = {
  Credential : Credential,
  PasswordCredential : PasswordCredential
};