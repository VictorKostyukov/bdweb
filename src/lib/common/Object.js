#! /usr/bin/env node

const _exception = require("./Exception.js");
const InvalidArgumentException = _exception.InvalidArgumentException;
const ObjectNotFoundException = _exception.ObjectNotFoundException;
const AlreadyExistException = _exception.AlreadyExistException;
const DbException = _exception.DbException;

const dbconn = require("./DbConnection.js").connection;


const __handleDbResult = function(err, result, resolve, reject) {
  if (err) {
    reject(new DbException(err));
  } else {
    resolve(result);
  }
};


class ObjectBase {
  constructor(type, path) {
    this._type = type;
    this._path = path;
  }

  async init(obj) {
    return this;
  }

  get type() {
    return this._type;
  }

  get path() {
    return this._path;
  }

  static create(path) {
    if (path.startsWith("system://")) {
      return new SystemObject(path);
    } else if (path.startsWith("name://")) {
      if (path.indexOf("/", "name://".length) >= 0) {
        return new DbObject(path);
      } else {
        return new DbCollectionObject(path);
      }
    } else {
      throw new InvalidArgumentException("path");
    }
  }
}


class SystemObject extends ObjectBase {
  constructor(path) {
    if (!path.startsWith("system://") || path.indexOf("/", "system://".length) >= 0) {
      throw new InvalidArgumentException("path");
    }

    let _type = "System" + path.substr("system://".length);

    super(_type, path);
  }
}


class DbCollectionObject extends ObjectBase {
  constructor(path) {
    if (!path.startsWith("name://") || path.indexOf("/", "name://".length) >= 0) {
      throw new InvalidArgumentException("path");
    }

    let _type = path.substr("name://".length);
    super(_type, path);

    this._name = _type;
    this._collection = "col_" + this._name;
  }


  get name() {
    return this._name;
  }

  
  get collection() {
    return this._collection;
  }


  async getChildren(query, offset, limit) {
    dbconn.assert();

    if (!offset || offset < 0) {
      offset = 0;
    }

    if (!limit || limit < 0) {
      limit = 100;
    }

    return new Promise((resolve, reject) => {
      dbconn.db.collection(this._collection)
        .find(query)
        .skip(offset)
        .limit(limit)
        .toArray(function(err, result) { __handleDbResult(err, result, resolve, reject); });
    });
  }


  async getChildCount(query) {
    dbconn.assert();

    return new Promise((resolve, reject) => {
      dbconn.db.collection(this._collection)
        .find(query)
        .count(function(err, result) { __handleDbResult(err, result, resolve, reject); });
    });
  }


  async hasChild(path) {
    let rtn = await this.getChildCount({Path : path});
    return rtn > 0;    
  }


  async getChild(path) {
    let rtn = await this.getChildren({Path: path}, 0, 1);
    if (rtn.length == 0) {
      throw new ObjectNotFoundException(path);
    }

    return rtn[0];
  }


  async addChild(type, path, props) {
    if (!path.startsWith("name://" + this._name + "/")) {
      throw new InvalidArgumentException("path");
    }

    if (await this.hasChild(path)) {
      throw new AlreadyExistException(path);
    }

    let obj = {
      Path : path,
      Type : type,
      Properties : props ? props : {}
    };

    return new Promise((resolve, reject) => {
      dbconn.db.collection(this._collection).updateOne(
        { Path : path },
        { "$set" : obj },
        { upsert : true },
        function(err, res) { __handleDbResult(err, res, resolve, reject); }
      );
    });
  }


  async updateChild(type, path, props) {
    if (!path.startsWith("name://" + this._name + "/")) {
      throw new InvalidArgumentException("path");
    }

    let obj = {
      Path : path,
      Type : type,
      Properties : props ? props : {}
    };

    return new Promise((resolve, reject) => {
      dbconn.db.collection(this._collection).updateOne(
        { Path : path },
        { "$set" : obj },
        { upsert : true },
        function(err, res) { __handleDbResult(err, res, resolve, reject); }
      );
    });
  }


  async deleteChild(path) {
    dbconn.assert();

    let _this = this;

    return new Promise((resolve, reject) => {
      dbconn.db.collection(_this._collection).remove(
        { Path : path },
        function(err, res) { __handleDbResult(err, res, resolve, reject); }
      );
    });
  }
}


class DbObject extends ObjectBase {
  constructor(path) {
    if (!path.startsWith("name://")) {
      throw new InvalidArgumentException("path");
    }

    let delim = path.indexOf("/", "name://".length);
    if (delim < 0 || delim == path.length - 1) {
      throw new InvalidArgumentException("path");
    }

    super(null, path);

    this._collection = path.substr("name://".length, delim - "name://".length);

    this._properties = {};
  }

  get colname() {
    return this._collection;
  }

  async init(obj) {
    if (!obj) {
      let colobj = new DbCollectionObject("name://" + this.colname);
      obj = await colobj.getChild(this._path);
    }

    if (!obj || !obj.Type) {
      throw new ObjectNotFoundException(this._path);
    }

    this._type = obj.Type;
    this._properties = obj.Properties ? obj.Properties : {};
    return this;
  }

  get properties() {
    return this._properties;
  }

  getProperty(key) {
    return this._properties[key];
  }

  hasProperty(key) {
    return this._properties.hasOwnProperty(key);
  }

  async flush() {
    let _this = this;

    let colobj = new DbCollectionObject("name://" + this.colname);
    return await colobj.updateChild(this._type, this._path, this._properties);
  }


  async setProperty(key, val) {
    this._properties[key] = val;
    return await this.flush();
  }

  async setProperties(props) {
    for (var key in props) {
      this._properties[key] = props[key];
    }
    return await this.flush();
  }
}


module.exports = {
  ObjectBase : ObjectBase,
  SystemObject : SystemObject,
  DbCollectionObject : DbCollectionObject,
  DbObject : DbObject
}
