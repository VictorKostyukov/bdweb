#! /usr/bin/env node

const dbconn = require("./DbConnection.js").connection;


class Transaction {
  constructor(session) {
    this._session = session;
    this._session.startTransaction();
  }

  
  async commit() {
    await this._session.commitTransaction();
    this._session.endSession();
  }


  async abort() {
    await this._session.abortTransaction();
    this._session.endSession();
  }


  static begin() {
    dbconn.assert();
    return new Transaction(dbconn.client.startSession());
  }
}


module.exports = {
  Transaction : Transaction
};