const View = require("../common/View.js").View;


class SystemHostView extends View {
  constructor(api) {
    super(api);
  }


  async model() {
    this.security.verify(this.api, "userPlus");

    let hosts = await this.api.GetHosts();
    let hostArr = [];

    for (let i = 0; i < hosts.length; ++i) {
      let props = await hosts[i].GetProperties();
      hostArr.push({
        Type : "Host",
        Path : hosts[i].path,
        Properties : props
      });
    }

    return this.__render({ hosts : hostArr });
  }
}


module.exports = {
  SystemHostView : SystemHostView
};
