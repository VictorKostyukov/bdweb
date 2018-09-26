const View = require("../View.jsx").View;
const loc = require("../Ui.js").UI.loc;


class SystemHostView extends View {
  constructor(props) {
    super(props);
  }


  __renderRegisterButton() {
    return (
      <button class="btn btn-primary">
        { loc("Register Host") }
      </button>
    );
  }


  __renderEmpty() {
    return (
      <div>
        <h1>You do not have registered hosts.</h1>
        { this.__renderRegisterButton() }
      </div>
    );
  }


  __renderHosts() {
    return (
      <div>
        <h1>{this.model.hosts.length} hosts found.</h1>
        { this.__renderRegisterButton() }
      </div>
    )
  }


  onRender() {
    if (this.model.hosts && this.model.hosts.length > 0) {
      return this.__renderHosts();
    } else {
      return this.__renderEmpty();
    }
  }
}


module.exports = {
  SystemHostView : SystemHostView
};
