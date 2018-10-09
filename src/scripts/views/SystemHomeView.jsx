const View = require("../View.jsx").View;
const Api = require("../Api.js").Api;
const UI = require("../Ui.js").UI;
const loc = UI.loc;
const _dialog = require("../controls/Dialog.jsx");
const Dialog = _dialog.Dialog;
const DialogHeader = _dialog.DialogHeader;
const DialogBody = _dialog.DialogBody;
const DialogFooter = _dialog.DialogFooter;
const MessageBox = _dialog.MessageBox;
const MessageBoxButtons = _dialog.MessageBoxButtons;


class SystemHomeView extends View {
  constructor(props) {
    super(props);
  }


  __renderBalance() {
    if (typeof(this.model.balance) !== "undefined") {
      return (
        <span class="col-4 mb-3">{this.model.balance}</span>
      );
    } else {
      let _this = this;

      let getBalance = async() => {
        let api = new Api(_this.model.user);
        return api.call("GetBalance");
      }

      let onShowBalance = event => {
        UI.account.unlockInvoke(getBalance, true, true)
          .then(balance => {
            if (balance !== null) {
              UI.refresh();
            }
          });
      };

      return (
        <div class="col-4 mb-3">
          <button type="button" class="btn btn-primary" onClick={onShowBalance}>{loc("Show My Balance")}</button>
        </div>
      );
    }
  }


  __renderActions() {
/*    if (typeof(this.model.balance) === "undefined") {
      return (null);
    }
*/

    let onWithdraw = () => {
      MessageBox.show(loc("Withdraw"), loc("Coming soon..."), MessageBoxButtons.OK, MessageBoxButtons.OK, 0);
    };

    return (
      <div class="col-sm-12 col-md-4 mb-3">
        <div class="d-flex flex-row">
          <button type="button" class="btn btn-outline-secondary bd-btn" data-toggle="modal" data-target="#depositeDialog">
            <i class="fa fa-plus-circle align-middle mr-1"></i>
            { loc("Deposite") }
          </button>
          <button type="button" class="btn btn-outline-secondary bd-btn ml-2" onClick={onWithdraw}>
            <i class="fa fa-minus-circle align-middle mr-1"></i>
            { loc("Withdraw") }
          </button>
        </div>
        <div>
          <Dialog id="depositeDialog" size="lg">
            <DialogHeader title={loc("Deposite")} />
            <DialogBody>
              <div class="container">
                <div class="row">
                  <div class="col-md-12 col-lg-6 mb-3">
                    <div class="card border-secondary h-100">
                      <div class="card-header">{ loc("Tokens") }</div>
                      <div class="card-body">
                        <h4>{ loc("Transfer Tokens") }</h4>
                        <p>{ loc("Deposite_Instruction_OtherWallet") }</p>
                        <div class="w-100 align-center text-light bg-info">
                          { this.model.account }
                        </div>
                      </div>
                    </div>
                  </div>
                  <div class="col-md-12 col-lg-6 mb-3">
                    <div class="card bg-light h-100">
                      <div class="card-header">{ loc("USD") }</div>
                      <div class="card-body">
                        <h4>{ loc("Purchase Tokens") }</h4>
                        <p>{ loc("Deposite_Instruction_Purchase") }</p>
                        <button type="btn btn-outline-secondary bd-btn" disabled>{ loc("Coming soon") }</button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </DialogBody>
            <DialogFooter>
              <button type="button" class="btn btn-primary bd-btn" data-dismiss="modal">{loc("Close")}</button>
            </DialogFooter>
          </Dialog>
        </div>
      </div>
    );
  }


  __renderShowDetails() {
    if (typeof(this.model.balance) === "undefined") {
      return (null);
    }
/*
    return (
      <div class="row mt-5">
        <button type="button" class="btn btn-link">{loc("Show details")}</button>
      </div>
    );
*/
    return (null);
  }


  onRender() {
    return (
      <div class="container-fluid">
        <h1 class="mb-4">{ loc("My Wallet") }</h1>
        <div class="row align-items-center">
          <span class="col-2 mb-3 font-weight-bold">{ loc("Balance (CMT)") }</span>
          { this.__renderBalance() }
          <div class="col-sm-6 col-md-2"></div>
          { this.__renderActions() }
        </div>
        { this.__renderShowDetails() }
      </div>
    );
  }
}


module.exports = {
  SystemHomeView : SystemHomeView
};