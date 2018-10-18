#! /usr/bin/env node

const crypto = require("crypto");


class SecureString {
  constructor() {
    this._data = null;
    this._salt = null;
  }


  get data() {
    return this._data;
  }


  get salt() {
    return this._salt;
  }


  async setRawData(data, password) {
    let salt = crypto.randomBytes(16).toString("binary");
    let key = await SecureString.deriveKey(password, salt, 32);
    this._data = SecureString.encrypt(data, key);
    this._salt = salt;
    return true;
  }


  setEncryptedData(data, salt) {
    this._data = data;
    this._salt = salt;
  }


  async getRawData(password) {
    let key = await SecureString.deriveKey(password, this._salt, 32);
    return SecureString.decrypt(this._data, key);
  }


  toJSON() {
    return {
      d : this._data,
      s : new Buffer(this._salt, "binary").toString("hex")
    };
  }


  fromJSON(obj) {
    this.setEncryptedData(obj.d, new Buffer(obj.s, "hex").toString("binary"));
  }


  static async deriveKey(password, salt, length) {
    return new Promise((resolve, reject) => {
      crypto.pbkdf2(password, salt, 1, length, "sha256", (err, key) => {
        if (err) {
          reject(err);
        } else {
          resolve(key);
        }
      });
    });
  }


  static encrypt(data, key) {
    let iv = crypto.randomBytes(16);

    let cipher = crypto.createCipheriv("aes-256-cbc", key, iv);
    let crypted = cipher.update(data, "utf8", "binary");
    crypted += cipher.final("binary");
    crypted += iv.toString("binary");

    return new Buffer(crypted, "binary").toString("base64");
  }


  static decrypt(data, key) {
    let crypted = new Buffer(data, "base64").toString("binary");
    let iv = new Buffer(crypted.substr(crypted.length - 16), "binary");
    crypted = crypted.substr(0, crypted.length - 16);
    let decipher = crypto.createDecipheriv("aes-256-cbc", key, iv);
    let decrypted = decipher.update(crypted, "binary", "utf8");
    decrypted += decipher.final("utf8");

    return decrypted;
  }
}


module.exports = SecureString;