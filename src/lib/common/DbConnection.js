#! /usr/bin/env node

const _exception = require("./Exception.js");
const DbException = _exception.DbException;
const InvalidOperationException = _exception.InvalidOperationException;


class DbConnection {

  constructor() {
    this._client = null;
    this._db = null;
    this._name = null;
  }


  get db() {
    return this._db;
  }


  get name() {
    return this._name;
  }

  
  async init(name) {
    const url = "mongodb://localhost:27017";

    let mongodb = require("mongodb");
    let rtn = await new Promise((resolve, reject) =>
      mongodb.MongoClient.connect(url, { useNewUrlParser : true}, function(err, result) {
        if (err) {
          reject(new DbException(err));
        } else {
          resolve(result);
        }
      }
    ));

    this._client = rtn;
    this._db = this._client.db(name);
    this._name = name;

    return rtn;
  }


  collection(key) {
    return _this._db.collection(key);
  }


  assert() {
    if (!this._client || !this._db) {
      throw new InvalidOperationException("Database connection is not available.");
    }
  }
}


module.exports = {
  connection : new DbConnection()
};