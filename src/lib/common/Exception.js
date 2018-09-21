#! /usr/bin/env node

const ERR_GENERIC = 1;
const ERR_INVALID_ARGUMENT = 2;
const ERR_NOT_SUPPORTED = 3;
const ERR_OBJECT_NOT_FOUND = 4;
const ERR_ALREADY_EXIST = 5;
const ERR_INVALID_OPERATION = 6;
const ERR_DATABASE = 101;
const ERR_LOGIN_EXPIRED = 201;
const ERR_ACCESS_DENIED = 202;


class Exception {
  constructor(msg, code) {
    this._msg = msg;
    this._code = code;
  }

  get message() {
    return this._msg;
  }

  get code() {
    return this._code;
  }
}


class InvalidArgumentException extends Exception {
  constructor(name) {
    super("Invalid argument: " + name, ERR_INVALID_ARGUMENT);
  }
}


class NotSupportedException extends Exception {
  constructor() {
    super("The operation is not supported", ERR_NOT_SUPPORTED);
  }
}


class ObjectNotFoundException extends Exception {
  constructor(path) {
    super("Object not found: " + path, ERR_OBJECT_NOT_FOUND);
    this._path = path;
  }

  get path() {
    return this._path;
  }
}


class AlreadyExistException extends Exception {
  constructor(path) {
    super("Target already exists: " + path, ERR_ALREADY_EXIST);
    this._path = path;
  }

  get path() {
    return this._path;
  }
}


class InvalidOperationException extends Exception {
  constructor(msg) {
    super("Invalid operation: " + msg, ERR_INVALID_OPERATION);
  }
}


class DbException extends Exception {
  constructor(err) {
    super("Database error", ERR_DATABASE);
    this._err = err;
  }

  get error() {
    return this._err;
  }
}


class LoginExpiredException extends Exception {
  constructor() {
    super("Login expired.", ERR_LOGIN_EXPIRED);
  }
}


class AccessDeniedException extends Exception {
  constructor() {
    super("Access denied.", ERR_ACCESS_DENIED);
  }
}


module.exports = {
  Exception : Exception,
  InvalidArgumentException : InvalidArgumentException,
  NotSupportedException : NotSupportedException,
  ObjectNotFoundException : ObjectNotFoundException,
  AlreadyExistException : AlreadyExistException,
  InvalidOperationException : InvalidOperationException,
  DbException : DbException,
  LoginExpiredException : LoginExpiredException,
  AccessDeniedException : AccessDeniedException
};