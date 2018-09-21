const UI = require("../Ui.js").UI;
const loc = UI.loc;


class NavigationBar extends React.PureComponent {
  constructor(props) {
    super(props);

    this._logo = props.logo;
    this._nav = props.nav ? props.nav : [];
    this._current = props.current;
    this._user = props.user;
  }


  get logo() {
    return this._logo;
  }


  get nav() {
    return this._nav;
  }


  get current() {
    return this._current;
  }

  get user() {
    return this._user;
  }


  __renderLogo() {
    if (this.logo) {
      return (
        <a class="navbar-brand" href="/" aria-label="Drive">
          <img src={this.logo} alt="Logo" height="32"></img>
        </a>
      );
    } else {
      return (<div class="navbar-brand" height="32"></div>);
    }
  }


  __renderNavItems() {
    if (this.nav && this.nav.length > 0) {
      return this.nav.map(item =>
        item.name === this.current
        ? <li class="nav-item active">
            <span class="nav-link">{item.text} <span class="sr-only">{ loc("SR_Current") }</span></span>
          </li>
        : <li class="nav-item">
            <a class="nav-link" href={item.href}>{item.text}</a>
          </li>
      );
    } else {
      return (null);
    }
  }


  __onLogout() {
    alert("Logout");
  }


  __renderUserButtons() {
    if (this.user) {
      return (
        <li class="nav-item">
          <a class="nav-link" onClick={() => this.__onLogout()} href="#">{ loc("Sign Out") }</a>
        </li>
      );
    } else {
      return (
        <li class="nav-item">
          <button class="btn btn-primary my-sm-0"
                  onClick={() => UI.redirect("/#/view/system/Security/Login")}>
            { loc("Sign In") }
          </button>
        </li>
      )
    }
  }


  render() {
    return (
      <nav class="navbar navbar-expand-md navbar-dark bg-dark mb-3 bd-nav-main">
        { this.__renderLogo() }
        <button class="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarsMain" aria-controls="navbarsMain" aria-expanded="false" aria-label="Toggle navigation">
          <span class="navbar-toggler-icon"></span>
        </button>

        <div class="collapse navbar-collapse" id="navbarsMain">
          <ul class="navbar-nav mr-auto">
            { this.__renderNavItems() }
          </ul>
          <ul class="navbar-nav my-2 my-lg-0">
            { this.__renderUserButtons() }
          </ul>
        </div>
      </nav>
    );
  }
}


module.exports = {
  NavigationBar : NavigationBar
};