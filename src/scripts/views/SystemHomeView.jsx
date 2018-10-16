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

    this.state = {};
  }


  __renderBalance() {
    let getBalance = async () => {
      let api = new Api(this.model.user);
      return await api.call("GetBalance", null, this.model.contractTimeout);
    };

    getBalance()
      .then(result => {
        this.setState({ balance: result });
      })
      .catch(ex => {
        throw ex;
      });

    let renderContent = () => {
      if (typeof(this.state.balance) !== "undefined") {
        return (<span>{this.state.balance.toFixed(this.model.tokenPrecision)} {this.model.tokenSymbol}</span>);
      } else {
        return (<i class="fa fa-circle-o-notch fa-spin"></i>);
      }
    };

    return (
      <div class="col-4 mb-3">
        { renderContent() }
      </div>
    );
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
          <button type="button" class="btn btn-outline-secondary bd-btn" data-toggle="modal" data-target="#transferDialog">
            <i class="fa fa-exchange align-middle mr-1"></i>
            { loc("Transfer") }
          </button>
          <button type="button" class="btn btn-outline-secondary bd-btn ml-2" data-toggle="modal" data-target="#depositeDialog">
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
                        <div class="w-100 d-flex justify-content-center text-light bg-info">
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
        <div>
          <Dialog id="transferDialog">
            <DialogHeader title={loc("Transfer")} />
            <DialogBody>
              <div class="container">
                <form>
                  <div class="form-group">
                    <label for="inputAccount">{ loc("Account to transfer to") }</label>
                    <input type="text" class="form-control" id="inputAccount" placeholder={ loc("Account name or @username") }></input>
                  </div>
                  <div class="form-group">
                    <label for="inputConfirmAccount">{ loc("Confirm the account to transfer to") }</label>
                    <input type="text" class="form-control" id="inputConfirmAccount" placeholder={ loc("Account name or @username") }></input>
                  </div>
                  <div class="form-group">
                    <label for="inputAmount">{ loc("Amount of tokens to transfer") }</label>
                    <input type="text" class="form-control" id="inputAmount"></input>
                  </div>
                  <div class="form-group">
                    <label for="inputPassword">{ loc("Password") }</label>
                    <input type="password" class="form-control" id="inputPassword" placeholder={ loc("Enter your password to authorize this transaction") }></input>
                  </div>
                </form>
              </div>
            </DialogBody>
            <DialogFooter>
              <button type="button" class="btn btn-outline-secondary bd-btn">{ loc("OK") }</button>
              <button type="button" class="btn btn-outline-secondary bd-btn" data-dismiss="modal">{ loc("Cancel") }</button>
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
          <span class="col-2 mb-3 font-weight-bold">{ loc("Balance") }</span>
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