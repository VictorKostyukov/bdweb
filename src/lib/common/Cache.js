#! /usr/bin/env node

const InvalidArgumentException = require("./Exception.js").InvalidArgumentException;
const crypto = require("crypto");


class Cache {
  constructor() {
    this._client = require("memory-cache");
    this._key = crypto.randomBytes(32);
  }


  put(key, value, timeout) {
    if (value === null) {
      throw new InvalidArgumentException("value");
    }
    this._client.put(key, value, timeout);
    return value;
  }


  putSecure(key, value, timeout) {
    this.put(key, this.__encrypt(value), timeout);
    return value;
  }


  get(key, onmiss) {
    let result = this._client.get(key);
    if (result === null && onmiss) {
      result = onmiss(key);
    }
    return result;
  }


  getSecure(key, onmiss) {
    let result = this._client.get(key);
    if (result === null && onmiss) {
      result = onmiss(key);
    } else {
      result = this.__decrypt(result);
    }
    return result;
  }


  del(key) {
    return this._client.del(key);
  }


  clear() {
    this._client.clear();
  }


  __encrypt(input) {
    if (typeof(input) === "undefined" || input === null) {
      return null;
    }

    let raw = JSON.stringify(input);
    const iv = crypto.randomBytes(16);
    const cipher = crypto.createCipheriv("aes-256-cbc", this._key, iv);
    
    let encrypted = cipher.update(raw);
    encrypted = Buffer.concat([encrypted, cipher.final()]);
    return iv.toString("hex") + encrypted.toString("hex");
  }


  __decrypt(input) {
    if (typeof(input) === "undefined" || input === null) {
      return null;
    }

    const iv = new Buffer(input.substr(0, 16 * 2), "hex");
    const encrypted = new Buffer(input.substr(16 * 2), "hex");

    const decipher = crypto.createDecipheriv("aes-256-cbc", this._key, iv);
    let decrypted = decipher.update(encrypted);
    decrypted = Buffer.concat([decrypted, decipher.final()]);

    return JSON.parse(decrypted.toString());
  }
}


const cache = new Cache();

module.exports = cache;