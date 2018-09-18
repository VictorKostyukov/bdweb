#! /usr/bin/env node

const _exception = require("Exception.js");
const DbException = _exception.DbException;
const InvalidOperationException = _exception.InvalidOperationException;


class DbConnection {

  constructor() {
    this.client = null;
    this.db = null;
    this.name = null;
  }

  
  get name() {
    return this.name;
  }


  init(name, onload) {
    const url = "mongodb://localhost:27017";
    let _this = this;

    let mongodb = require("mongodb");
    mongodb.MongoClient.connect(url, { useNewUrlParser : true }, function(err, result) {
      if (err) {
        throw new DbException(err);
      }

      _this.client = result;
      _this.db = _this.client.db(name);
      _this.name = name;
    });
  }


  collection(key) {
    return _this.db.collection(key);
  }


  assert() {
    if (!this.client || !this.db) {
      throw new InvalidOperationException("Database connection is not available.");
    }
  }

  static connection = new DbConnection();
}


module.exports = {
  DbConnection : DbConnection
}