#! /usr/bin/env node

const _exception = require("Exception.js");
const InvalidArgumentException = _exception.InvalidArgumentException;
const NotSupportedException = _exception.NotSupportedException;
const ObjectNotFoundException = _exception.ObjectNotFoundException;
const AlreadyExistException = _exception.AlreadyExistException;
const InvalidOperationException = _exception.InvalidOperationException;
const DbException = _exception.DbException;

const db = require("DbConnection.js").DbConnection.db;


class ObjectBase {
  constructor(type, path, onload) {
    this.type = type;
    this.path = path;

    this.__load(onload);
  }

  get type() {
    return this.type;
  }

  get path() {
    return this.path;
  }

  __load(oncomplete) {
    if (oncomplete) {
      oncomplete(this);
    }
  }


  static create(path, onload) {
    if (path.startsWith("system://")) {
      return new SystemObject(path, onload);
    } else if (path.startsWith("name://")) {
      if (path.indexOf("/", "name://".length) >= 0) {
        return new DbObject(path, onload);
      } else {
        return new DbCollectionObject(path, onload);
      }
    } else {
      throw new InvalidArgumentException("path");
    }
  }
}


class SystemObject extends ObjectBase {
  constructor(path, onload) {
    if (!path.startsWith("system://") || path.indexOf("/", "system://".length) >= 0) {
      throw new InvalidArgumentException("path");
    }

    let _type = "System" + path.substr("system://".length);

    super(_type, path, onload);
  }

  flush(oncomplete) {
    throw new NotSupportedException();
  }
}


class DbCollectionObject extends ObjectBase {
  constructor(path, onload) {
    if (!path.startsWith("name://") || path.indexOf("/", "name://".length) >= 0) {
      throw new InvalidArgumentException("path");
    }

    this.name = path.substr("name://".length);
    this.collection = "col_" + this.name;
    let _type = "Collection" + this.name;

    super(_type, path, onload);
  }


  get name() {
    return this.name;
  }

  
  get collection() {
    return this.collection;
  }


  getChildren(query, offset, limit, callback) {
    db.assert();

    if (!offset || offset < 0) {
      offset = 0;
    }

    if (!limit || limit < 0) {
      limit = 100;
    }

    db.collection(this.collection)
      .find(query)
      .skip(offset)
      .limit(limit)
      .toArray(function(err, result) {
        if (err) { throw new DbException(err); }
        if (callback) {
          callback(result);
        }
      });
  }


  getChildCount(query, callback) {
    db.assert();

    db.collection(this.collection).find(query).count(function(err, result) {
      if (err) { throw new DbException(err); }
      if (callback) {
        callback(result);
      }
    });
  }


  hasChild(path, callback) {
    this.getChildCount({path : path}, function(count) {
      if (callback) {
        callback(count > 0);
      }
    });
  }


  getChild(path, callback) {
    this.getChildren({path : path}, 0, 1, function(result) {
      if (result.length == 0) {
        throw new ObjectNotFoundException(path);
      }
      if (callback) {
        callback(result[0]);
      }
    });
  }


  addChild(type, path, props, callback) {
    if (!path.startsWith("name://" + this.name + "/")) {
      throw new InvalidArgumentException("path");
    }

    let _this = this;

    this.hasChild(path, function(exist) {
      if (exist) {
        throw new AlreadyExistException(path);
      }

      let obj = {
        Path : path,
        Type : type,
        Properties : props ? props : {}
      };

      db.collection(_this.collection).updateOne({ path : path }, { "$set" : obj }, { upsert : true }, function(err, res) {
        if (err) { throw new DbException(err); }
        if (callback) {
          callback(true);
        }
      });
    });
  }


  updateChild(type, path, props, callback) {
    if (!path.startsWith("name://" + this.name + "/")) {
      throw new InvalidArgumentException("path");
    }

    let _this = this;

    let obj = {
      Path : path,
      Type : type,
      Properties : props ? props : {}
    };

    db.collection(_this.collection).updateOne({ path : path }, { "$set" : obj }, { upsert : true }, function(err, res) {
      if (err) { throw new DbException(err); }
      if (callback) {
        callback(true);
      }
    });
  }


  deleteChild(path, callback) {
    db.assert();

    let _this = this;

    db.collection(_this.collection).remove({path : path}, function(err, res) {
      if (err) { throw new DbException(err); }
      if (callback) {
        callback(true);
      }
    });
  }
}


class DbObject extends ObjectBase {
  constructor(path, onload) {
    if (!path.startsWith("name://")) {
      throw new InvalidArgumentException("path");
    }

    let delim = path.indexOf("/", "name://".length);
    if (delim < 0 || delim == path.length - 1) {
      throw new InvalidArgumentException("path");
    }

    this.collection = path.substr("name://".length, delim - "name://".length);

    this.properties = {};

    super(null, path, onload);
  }

  get properties() {
    return this.properties;
  }

  getProperty(key) {
    return this.properties[key];
  }

  hasProperty(key) {
    return this.properties.hasOwnProperty(key);
  }

  setProperty(key, val, oncomplete) {
    this.properties[key] = val;
    this.flush(oncomplete);
  }

  setProperties(props, oncomplete) {
    for (var key in props) {
      this.properties[key] = props[key];
    }
    this.flush(oncomplete);
  }

  flush(oncomplete) {
    let _this = this;

    let colobj = new DbCollectionObject("name://" + this.colname);
    colobj.updateChild(_this.type, _this.path, _this.properties, function(res) {
      if (oncomplete) {
        oncomplete(_this);
      }
    });
  }


  __load(oncomplete) {
    let _this = this;

    let colobj = new DbCollectionObject("name://" + this.colname);
    colobj.getChild(this.path, function(obj) {
      if (!obj || !obj.Type) {
        throw new ObjectNotFoundException(_this.path);
      }

      _this.type = obj.Type;
      _this.properties = obj.Properties ? obj.Properties : {};
      if (oncomplete) {
        oncomplete(_this);
      }
    });
  }
}


module.exports = {
  ObjectBase : ObjectBase,
  SystemObject : SystemObject,
  DbCollectionObject : DbCollectionObject,
  DbObject : DbObject
}
