const View = require("../View.jsx").View;
const UI = require("../Ui.js").UI;
const loc = UI.loc;
const _dialog = require("../controls/Dialog.jsx");
const Dialog = _dialog.Dialog;
const DialogHeader = _dialog.DialogHeader;
const DialogBody = _dialog.DialogBody;
const DialogFooter = _dialog.DialogFooter;
const Api = require("../Api.js").Api;


class SystemHostView extends View {
  constructor(props) {
    super(props);
  }


  __renderHostTable() {
    return (
      <table class="table table-striped mb-4">
        <thead>
          <th scope="col">{ loc("ID") }</th>
          <th scope="col">{ loc("Address") }</th>
          <th scope="col">{ loc("Available Space") }</th>
          <th scope="col">{ loc("Total Space") }</th>
          <th scope="col">{ loc("Last Updated Time") }</th>
        </thead>
        <tbody>
          {
            this.model.hosts.map(host => (
              <tr>
                <td>{ host.Properties.Id }</td>
                <td>{ host.Properties.Address }</td>
                <td>{ UI.size.toString(host.Properties.AvailableSpace) }</td>
                <td>{ UI.size.toString(host.Properties.TotalSpace) }</td>
                <td>{ UI.timestamp.toLocaleString(host.Properties.LastUpdateTime) }</td>
              </tr>
            ))
          }
        </tbody>
      </table>
    );
  }


  __renderRegisterDialog() {
    let renderButton = (text, style, dismiss, onclick) => {
      return (
        <button type="button" class={`btn bd-btn ${style}`} onClick={onclick}
                data-dismiss={dismiss ? "modal" : undefined}>
          {text}
        </button>
      );
    };

    let hostId = "";
    let onChange = event => {
      hostId = event.target.value;
    };

    let onOK = () => {
      let value = hostId.trim();
      if (value.length < 1) {
        throw Error(loc("Invalid Host ID."));
      }

      let api = new Api("system://Host");
      api.call("RegisterHost", {
        id : value
      }).then(result => {
        $("#registerHostDialog").modal("hide");
        UI.refresh();
      });
    };

    return (
      <Dialog id="registerHostDialog">
        <DialogHeader showCloseButton="true" title={loc("Register Host")} />
        <DialogBody>
          <form class="p-3">
            <p>{ loc("Help_FindHostID") }</p>
            <p>{ loc("Label_InputHostID") }</p>
            <div class="mt-5 form-group row">
              <label for="inputHostId" class="col-sm-2 col-form-label">{loc("Host ID")}</label>
              <input type="text" class="form-control col-sm-9" id="inputHostId" placeholder={loc("Input host ID here")} onChange={onChange}></input>
            </div>
          </form>
        </DialogBody>
        <DialogFooter>
          { renderButton(loc("OK"), "btn-primary", false, onOK) }
          { renderButton(loc("Cancel"), "btn-secondary", true) }
        </DialogFooter>
      </Dialog>
    );
  }


  onRender() {
    return (
      <div>
        <h1 class="mb-4">{ loc("My Hosts") } <span class="badge badge-pill badge-info bd-badge-corner mt-2">{ this.model.hosts.length }</span></h1>
        { this.model.hosts && this.model.hosts.length > 0
          ? this.__renderHostTable()
          : <div>{ loc("You do not have any registered hosts.") }</div>
        }
        <button type="button" class="btn btn-primary" data-toggle="modal" data-target="#registerHostDialog">{ loc("Register Host") }</button>
        { this.__renderRegisterDialog() }
      </div>
    );
  }
}


module.exports = {
  SystemHostView : SystemHostView
};
