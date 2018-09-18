#! /usr/bin/env node

class Exception {
  constructor(msg) {
    this.msg = msg;
  }

  get message() {
    return this.message;
  }
}


class InvalidArgumentException extends Exception {
  constructor(name) {
    super("Invalid argument: " + name);
  }
}


class NotSupportedException extends Exception {
  constructor() {
    super("The operation is not supported");
  }
}


class ObjectNotFoundException extends Exception {
  constructor(path) {
    super("Object not found: " + path);
    this.path = path;
  }

  get path() {
    return this.path;
  }
}


class AlreadyExistException extends Exception {
  constructor(path) {
    super("Target already exists: " + path);
    this.path = path;
  }

  get path() {
    return this.path;
  }
}


class InvalidOperationException extends Exception {
  constructor(msg) {
    super("Invalid operation: " + msg);
  }
}


class DbException extends Exception {
  constructor(err) {
    super("Database error");
    this.err = err;
  }

  get error() {
    return this.err;
  }
}


module.exports = {
  Exception : Exception,
  InvalidArgumentException : InvalidArgumentException,
  NotSupportedException : NotSupportedException,
  ObjectNotFoundException : ObjectNotFoundException,
  AlreadyExistException : AlreadyExistException,
  InvalidOperationException : InvalidOperationException,
  DbException : DbException
};