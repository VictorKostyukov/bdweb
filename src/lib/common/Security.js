#! /usr/bin/env node

const crypto = require("crypto");
const ObjectBase = require("./Object.js").ObjectBase;
const _exceptions = require("./Exception.js");
const AccessDeniedException = _exceptions.AccessDeniedException;
const LoginExpiredException = _exceptions.LoginExpiredException;


const Role = {
  superuser : "superuser",
  admin : "admin",
  user : "user",
  server : "server",
  anonymouse : "anonymouse"
};


const PredefinedRules = {
  superuser : "superuser",
  admin : "admin",
  user : "user",
  server : "server",
  anonymouse : "anonymouse",
  owner : { owner : true },
  adminPlus : { or : [ "superuser", "admin" ]},
  serverPlus : { or : [ "superuser", "server" ]},
  serverAdminPlus : { or : [ "superuser", "admin", "server" ]},
  ownerPlus : { or : [ "serverAdminPlus", "owner" ]},
  serverOwner : { or : [ "server", "owner" ]},
  userPlus : { or : [ "ownerPlus", "user" ]},
  everyone : { or : [ "userPlus", "anonymouse" ]},
  changeRole : { changeRole : true }
};


class Security {
  constructor(user) {
    this._user = null;
    this._role = Role.anonymouse;

    if (user) {
      this.user = user;
    }
  }


  // TODO: load the shared key from conf file
  static get sharedKey() {
    if (!Security._sharedKey) {
      Security._sharedKey = crypto.randomBytes(16);
    }
    return Security._sharedKey;
  }


  get user() {
    return this._user;
  }

  get role() {
    return this._role;
  }

  set user(val) {
    this._user = val;
    if (val) {
      this._role = val.getProperty("Role");
    } else {
      this._role = Role.anonymouse;
    }
  }


  verify(target, rule) {
    if (!this.__verifyNoThrow(target, rule)) {
      throw new AccessDeniedException();
    }

    return true;
  }


  getSecurityToken(expires) {
    if (!expires) {
      expires = 30 * 60;
    }

    let now = Math.floor(new Date() / 1000);
    let expireTime = now + expires;

    let payload = JSON.stringify({
      "t" : "s",
      "c" : this.user.path,
      "v" : now,
      "e" : expireTime
    });

    let iv = crypto.randomBytes(16);

    let cipher = crypto.createCipheriv("aes-128-cbc", Security.sharedKey, iv);
    let crypted = cipher.update(payload, "utf8", "binary");
    crypted += cipher.final("binary");
    crypted += iv.toString("binary");

    payload = new Buffer(crypted, "binary").toString("base64");

    let hmac = crypto.createHmac("md5", Security.sharedKey);
    let hash = hmac.update(payload);
    hmac = crypto.createHmac("md5", hash.digest("binary"));
    hash = hmac.update(payload);

    let token = {
      "p" : payload,
      "h" : hash.digest("hex")
    }

    return new Buffer(JSON.stringify(token), "utf8").toString("base64");
  }


  shouldRenewSecurityToken(expires) {
    return expires < (new Date() / 1000) + 5 * 60;
  }


  async parseSecurityToken(token) {
    if (!token || token === "") {
      return 0;
    }

    try {
      let tokenObj = JSON.parse(new Buffer(token, "base64").toString("utf8"));

      let hmac = crypto.createHmac("md5", Security.sharedKey);
      let hash = hmac.update(tokenObj.p);
      hmac = crypto.createHmac("md5", hash.digest("binary"));
      hash = hmac.update(tokenObj.p);

      if (hash.digest("hex") !== tokenObj.h) {
        throw Error("Invalid security token.");
      }

      let crypted = new Buffer(tokenObj.p, "base64").toString("binary");
      let iv = new Buffer(crypted.substr(crypted.length - 16), "binary");
      crypted = crypted.substr(0, crypted.length - 16);
      let decipher = crypto.createDecipheriv("aes-128-cbc", Security.sharedKey, iv);
      let decrypted = decipher.update(crypted, "binary", "utf8");
      decrypted += decipher.final("utf8");

      let payload = JSON.parse(decrypted);
      if (payload.t !== "s" || !payload.e || !payload.c) {
        throw Error("Unknown security token");
      }

      if (payload.e < new Date() / 1000) {
        throw new LoginExpiredException();
      }

      let user = ObjectBase.create(payload.c);
      await user.init();

      this.user = user;

      return payload.e;
    } catch (ex) {
      console.warn("Failed to parse security token: " + ex.message ? ex.message : ex);
      throw new LoginExpiredException();
    }
  }


  __verifyNoThrow(target, rule) {
    if (!target || !rule) {
      return false;
    }

    let success = false;

    if (typeof(rule) === "string") {
      success = this.__verifyPredefined(target, rule);
    } else if (rule.or) {
      for (let i = 0; i < rule.or.length; ++i) {
        let item = rule.or[i];
        if (this.__verifyNoThrow(target, item)) {
          success = true;
          break;
        }
      }
    } else if (rule.and) {
      success = true;
      for (let i = 0; i < rule.and.length; ++i) {
        let item = rule.and[i];
        if (!this.__verifyNoThrow(target, item)) {
          success = false;
          break;
        }
      }
    } else if (rule.owner) {
      success = this.__verifyOwner(target);
    } else if (rule.changeRole) {
      success = this.__verifyChangeRole(target);
    }

    return success;
  }


  __verifyOwner(target) {
    if (this.role === Role.anonymouse) {
      return false;
    }

    return target.getProperty("Owner") === this.user.path;
  }


  __verifyPredefined(target, key) {
    if (!key in PredefinedRules) {
      return false;
    }

    let rule = PredefinedRules[key];
    if (typeof(rule) === "string") {
      return this.role === Role[rule];
    } else {
      return this.__verifyNoThrow(target, rule);
    }
  }


  __verifyChangeRole(target) {
    let origin = target.Role ? target.Role : target.getProperty("Role");
    let newRole = target.NewRole;

    if (newRole === Role.anonymouse || newRole === Role.server) {
      return false;
    }

    switch (origin) {
      case Role.superuser:
        return this.role === Role.superuser;

      case Role.admin:
        return newRole === Role.superuser ? this.role === Role.superuser : this.role === Role.admin;

      case Role.user:
        return this.role === Role.superuser || (this.role === Role.admin && newRole != Role.superuser);
    }

    return false;
  }
}


module.exports = {
  Security : Security,
  Role : Role,
  PredefinedRules : PredefinedRules
};