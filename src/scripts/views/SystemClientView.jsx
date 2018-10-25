const View = require("../View.jsx").View;
const UI = require("../Ui.js").UI;
const loc = UI.loc;


class SystemClientView extends View {
  constructor(props) {
    super(props);
  }


  __renderClientTable() {
    return (null);
  }


  __renderRegisterDialog() {
    return (null);
  }


  onRender() {
    return (
      <div>
        <h1 class="mb-4">{ loc("My Clients") } <span class="badge badge-pill badge-info bd-badge-corner mt-2">{ this.model.clients.length }</span></h1>
        { this.model.clients && this.model.clients.length > 0
          ? this.__renderClientTable()
          : <p class="mb-4">{ loc("You do not have any registered clients.") }</p>
        }
        <button type="button" class="btn btn-primary" data-toggle="modal" data-target="#registerClientDialog">{ loc("Register Client") }</button>
        { this.__renderRegisterDialog() }
      </div>
    );
  }
}


module.exports = {
  SystemClientView : SystemClientView
};