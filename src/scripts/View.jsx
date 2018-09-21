const NavigationBar = require("./controls/NavigationBar.jsx").NavigationBar;
const loc = require("./Ui.js").UI.loc;


class View extends React.PureComponent {
  constructor(props) {
    super(props);

    this._path = props.path;
    this._type = props.type;
    this._model = props.model;
    this._location = props.location;
  }

  get path() {
    return this._path;
  }

  get type() {
    return this._type;
  }

  get model() {
    return this._model;
  }

  get location() {
    return this._location;
  }

  
  onRender() {
    return (null);
  }


  __renderNavigationBar() {
    let props = this.model && this.model.view && this.model.view.navigationBar ? this.model.view.navigationBar : {};

    if (!props.hidden) {
      let navs = [
        { name : "Home", text : loc("Nav_Home"), href : "#" },
        { name : "Hosts", text : loc("Nav_Hosts"), href : "#" },
        { name : "Clients", text : loc("Nav_Clients"), href : "#" },
        { name : "Contracts", text : loc("Nav_Contracts"), href : "#" }
      ];

      return (
        <NavigationBar nav={navs} current={props.current} logo="/res/img/drive_logo.png">
        </NavigationBar>
      );
    } else {
      return (null);
    }
  }


  render() {
    const _Page = () => this.onRender();

    let props = this.model && this.model.view ? this.model.view : {};
    let page;
    if (props.noContainer) {
      page = (<_Page />);
    } else {
      page = (
        <div class="container">
          <_Page />
        </div>
      );
    }

    return (
      <div class="bd-container">
        { this.__renderNavigationBar() }
        { page }
      </div>
    );
  }
}


module.exports = {
  View : View
};