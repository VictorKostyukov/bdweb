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
        <a class="navbar-brand mr00 mr-md-2" href="/" aria-label="Drive">
          <img src={this.logo} alt="Logo" width="200" height="100"></img>
        </a>
      );
    } else {
      return (<div width="200" height="100"></div>);
    }
  }


  __renderNavItems() {
    if (this.nav && this.nav.length > 0) {
      return this.nav.map(item =>
        <li class="nav-item">
          <a class={"nav-link" + (item.name === this.current ? " active" : "")} href={item.href}>{item.text}</a>
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
          <a class="nav-link" onClick={() => this.__onLogout()} href="#">Logout</a>
        </li>
      );
    } else {
      return (
        <li class="nav-item">
          <a class="btn d-done d-lg-inline-block mb-3 mb-md-0 ml-md-3" href="/#/view/system/Security/Login">
            Login
          </a>
        </li>
      )
    }
  }


  render() {
    return (
      <nav class="navbar navbar-expand navbar-light bg-light">
        { this.__renderLogo() }
        <div class="navbar-nav-scroll">
          <ul class="navbar-nav bd-navbar-nav flex-row">
            { this.__renderNavItems() }
          </ul>
          <ul class="navbar-nav flex-row ml-md-auto d-done d-md-flex">
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