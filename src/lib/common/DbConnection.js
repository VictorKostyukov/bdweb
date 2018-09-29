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


  get client() {
    return this._client;
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

    this.__initIndex();

    return rtn;
  }


  __initIndex() {
    const fs = require("fs");
    fs.readdirSync(__dirname + "/../api").forEach(file => {
      if (!file.endsWith("Api.js") || file.startsWith("System")) {
        return;
      }

      let className = file.substr(0, file.length - ".js".length);
      let collectionName = "col_" + className.substr(0, className.length - "Api".length);

      let classDef = require("../api/" + file)[className];
      if (!classDef || !classDef.index) {
        return;
      }

      console.log(`Processing index for ${collectionName}`);

      let dbo = this.collection(collectionName);
      for (let i = 0; i < classDef.index.length; ++i) {
        dbo.createIndex(classDef.index[i]);
      }
    });
  }


  collection(key) {
    return this._db.collection(key);
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