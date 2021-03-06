const View = require("../View.jsx").View;
const UI = require("../Ui.js").UI;
const loc = UI.loc;
const Api = require("../Api.js").Api;
const _dlg = require("../controls/Dialog.jsx");
const ProgressDialog = _dlg.ProgressDialog;
const Dialog = _dlg.Dialog;
const DialogHeader = _dlg.DialogHeader;
const DialogBody = _dlg.DialogBody;
const DialogFooter = _dlg.DialogFooter;


class SystemSecurityView extends View {
  constructor(props) {
    super(props);

    this.state = {
      ownerKey : ""
    };
  }


  onRenderLogin() {
    let formData = {};

    let onFormDataChange = event => {
      const target = event.target;
      formData[target.id] = target.value;
    };

    let onSubmit = event => {
      if (!formData.inputUserName || !formData.inputPassword) {
        throw Error(loc("Please enter your user name and password."));
      } else {
        let api = new Api("system://Security");
        api.call("LoginPassword", {
          username : formData.inputUserName,
          password : formData.inputPassword
        }).then(result => {
          UI.redirect("/#/view/system/Home/");
        });
      }

      event.preventDefault();
    };

    return (
      <div class="text-center form-login-container">
        <form class="form-login" autoComplete="on" onSubmit={onSubmit}>
          <img class="mb-5" src="/res/img/drive_logo.png" alt="" height="50"></img>
          <label for="inputUserName" class="sr-only">{ loc("Email address") }</label>
          <input type="email" id="inputUserName" class="form-control" placeholder={loc("Email address")} onChange={onFormDataChange} required autofocus></input>
          <label for="inputPassword" class="sr-only">{ loc("Password") }</label>
          <input type="password" id="inputPassword" class="form-control" placeholder={loc("Password")} onChange={onFormDataChange} autoComplete="off" required></input>

          <a class="float-right mb-4" href="#">{loc("Forgot password?")}</a>
          <button class="btn btn-lg btn-primary btn-block" type="submit">{loc("Sign in")}</button>

          <p class="float-left mt-2">
            <span class="mr-2">{loc("New to Drive?")}</span>
            <a href="/#/view/system/Security/SignUp">{loc("Sign up now >>")}</a>
          </p>

          <p class="mt-5 mb-3 text-muted">&copy; 2018 Drvcoin</p>
        </form>
      </div>
    );
  }


  onRenderSignUp() {
    let formData = {};

    let onFormDataChange = event => {
      const target = event.target;
      formData[target.id] = target.value;
    };

    let viewState = {};

    let onProgressShown = () => {
      viewState.worker().then(ownerKey => {
        viewState.ownerKey = ownerKey;
        $("#dlg-signup-progress").modal("hide");
      }).catch(ex => {
        viewState.error = ex;
        $("#dlg-signup-progress").modal("hide");
      });
    };

    let onProgressHidden = () => {
      if (!viewState.error) {
        this.setState({ ownerKey : viewState.ownerKey });
        $("#dlg-signup-complete").modal("show");
      } else {
        throw viewState.error;
      }
    };

    let onCompleteHidden = () => {
      UI.redirect("/#/view/system/Home/");
    };

    let onSubmit = event => {
      if (formData.inputPassword !== formData.inputConfirmPassword) {
        throw Error(loc("Password does not match."));
      } else {
        this.setState({ ownerKey : "" });

        viewState.worker = async () => {
          let api = new Api("system://Security");
          await api.call("RegisterUser", {
            username : formData.inputUserName,
            password : formData.inputPassword
          });

          let account = await api.call("CreateAccount", { password : formData.inputPassword }, this.model.eosTimeout);
          return account.OwnerKey;
        };

        $("#dlg-signup-progress").modal("show");
      }

      event.preventDefault();
    };

    return (
      <div class="form-signup-container">
        <form class="text-center form-signup needs-validation" autoComplete="on" onSubmit={onSubmit}>
          <h3 class="mb-4">{loc("Register a new account")}</h3>
          <label class="float-left" for="inputUserName">{ loc("Email address") }</label>
          <input type="email" id="inputUserName" class="form-control" placeholder={loc("Email address")} onChange={onFormDataChange} required autofocus></input>
          <label class="float-left" for="inputPassword">{ loc("Password") }</label>
          <input type="password" id="inputPassword" class="form-control" placeholder={loc("Password")} onChange={onFormDataChange} autoComplete="off" required></input>
          <label class="float-left" for="inputConfirmPassword">{ loc("Confirm password") }</label>
          <input type="password" id="inputConfirmPassword" class="form-control" placeholder={loc("Password")} onChange={onFormDataChange} autoComplete="off" required></input>

          <button class="btn btn-lg btn-primary btn-block" type="submit">{loc("Register")}</button>

          <a class="float-left mt-2" href="/#/view/system/Security/Login">{loc("Already have an account?")}</a>

          <p class="mt-5 mb-3 text-muted">&copy; 2018 Drvcoin</p>
        </form>
        <ProgressDialog id="dlg-signup-progress" title={ loc("Signing Up") }
                        message={ loc("Dlg_Create_Account_Progress") }
                        onShown={onProgressShown} onHidden={onProgressHidden}>
        </ProgressDialog>
        <Dialog id="dlg-signup-complete" disableFade="true" onHidden={onCompleteHidden}>
          <DialogHeader title={ loc("Welcome") }></DialogHeader>
          <DialogBody>
            <h4 class="mb-3">{ loc("Congratulations!") }</h4>
            <p>{ loc("Dlg_SignUp_Complete_Line1") }</p>
            <p>{ loc("Dlg_SignUp_Complete_Line2") }</p>
            <p class="text-danger pb-2">{ loc("Dlg_SignUp_Complete_Line3") }</p>
            <div class="w-100 mb-3 px-3">
              <div class="w-100 py-1 d-flex justify-content-center bg-info">
                <code class="text-light">{ this.state.ownerKey }</code>
              </div>
            </div>
          </DialogBody>
          <DialogFooter>
            <button type="button" class="btn btn-primary bd-btn" data-dismiss="modal">{ loc("OK") }</button>
          </DialogFooter>
        </Dialog>
      </div>
    );
  }


  onRender() {
    switch (this.location.action) {
      case "Login":
      {
        return this.onRenderLogin();
      }

      case "SignUp":
      {
        return this.onRenderSignUp();
      }

      default:
      {
        return (null);
      }
    }
  }
}


module.exports = {
  SystemSecurityView : SystemSecurityView
};