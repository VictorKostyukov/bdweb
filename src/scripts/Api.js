class Api {
  constructor(path) {
    this._path = path;
    this._type = null;

    let delim = this.path.indexOf("://");
    if (delim < 0) {
      throw Error("Invalid object path.");
    }

    this._baseUrl = "/api/" + path.substr(0, delim) + path.substr(delim + 2);
  }

  get path() {
    return this._path;
  }

  get baseUrl() {
    return this._baseUrl;
  }

  async getType() {
    if (this._type) {
      return this._type;
    } else {
      let obj = await this.call();
      return obj.Type;
    }
  }


  async call(action, args) {
    let url = this.baseUrl + "/" + (action ? action : "");

    return new Promise((resolve, reject) => {
      $.ajax(url, {
        data : JSON.stringify(args ? args : {}),
        contentType : "application/json",
        type : "POST"
      }).done(function(data) {
        if (data.Type === "Error") {
          console.error(data);
          reject(data);
        } else {
          resolve(data);
        }
      }).fail(function(jqXHR, status, err) {
        reject(err);
      });
    });
  }
}


module.exports = {
  Api : Api
};