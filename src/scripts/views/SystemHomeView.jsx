const View = require("../View.jsx").View;
const Api = require("../Api.js").Api;
const UnlockAccountDialog = require("../controls/UnlockAccountDialog.jsx").UnlockAccountDialog;
const UI = require("../Ui.js").UI;
const loc = UI.loc;


class SystemHomeView extends View {
  constructor(props) {
    super(props);
  }


  __renderBalance() {
    if (this.model.balance) {
      return (
        <span class="col-4">{this.model.balance}</span>
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
        <div class="col-4">
          <button type="button" class="btn btn-primary" onClick={onShowBalance}>{loc("Show Balance")}</button>
        </div>
      );
    }
  }


  onRender() {
    return (
      <div>
        <h1 class="mb-4">{ loc("My Wallet") }</h1>
        <div class="row">
          <span class="col-2 text-bold">Balance</span>
          { this.__renderBalance() }
        </div>
      </div>
    );
  }
}


module.exports = {
  SystemHomeView : SystemHomeView
};