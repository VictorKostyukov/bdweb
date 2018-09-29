const _dialog = require("./Dialog.jsx");
const Dialog = _dialog.Dialog;
const DialogHeader = _dialog.DialogHeader;
const DialogBody = _dialog.DialogBody;
const DialogFooter = _dialog.DialogFooter;
const UI = require("../Ui.js").UI;
const loc = UI.loc;


class UnlockAccountDialog extends React.PureComponent {
  constructor(props) {
    super(props);

    this._id = this.props.id;
    if (!this._id) {
      this._id = UI.nextGlobalId();
    }
  }


  render() {
    let password = "";
    let onChange = event => {
      password = event.target.value;
    };

    let renderButton = (text, style, dismiss, onclick) => {
      return (
        <button type="button" class={`btn bd-btn ${style}`} onClick={onclick}
                data-dismiss={dismiss ? "modal" : undefined}>
          {text}
        </button>
      );
    };

    let value = null;
    let onOK = event => {
      value = password.trim();
      $(`#${this._id}`).modal("hide");
    };

    let onHidden = event => {
      if (this.props.onClose) {
        this.props.onClose(value);
      }
    };

    return(
      <Dialog key={this._id} id={this._id} onHidden={onHidden}>
        <DialogHeader showCloseButton="true" title={ loc("Unlock Account") } />
        <DialogBody>
          <form class="p-3">
            <p>{ loc("Input password to unlock your account for further operations.") }</p>
            <input type="password" class="form-control" id="inputPassword" placeholder={loc("Input password")} onChange={onChange}></input>
          </form>
        </DialogBody>
        <DialogFooter>
          { renderButton(loc("OK"), "btn-outline-secondary", false, onOK) }
          { renderButton(loc("Cancel"), "btn-outline-secondary", true) }
        </DialogFooter>
      </Dialog>
    );
  }


  static async show() {
    let worker = async () => new Promise((resolve, reject) => {
      Dialog.show(
        <UnlockAccountDialog onClose={resolve} />
      );
    });

    return worker();
  }
}


module.exports = {
  UnlockAccountDialog : UnlockAccountDialog
};