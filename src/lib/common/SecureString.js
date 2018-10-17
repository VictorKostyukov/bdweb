#! /usr/bin/env node

const crypto = require("crypto");


class SecureString {
  constructor() {
  }


  setRawData(data, password) {

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
}


module.exports = SecureData;