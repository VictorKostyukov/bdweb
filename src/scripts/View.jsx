const NavigationBar = require("./controls/NavigationBar.jsx").NavigationBar;


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


  render() {

    const _Page = () => this.onRender();

    return (
      <div>
        <NavigationBar nav={[{name: "test1", text: "Test1", href:"#"}, {name:"test2", text:"Test2", href:"#"}]} 
                       current="test2">
        </NavigationBar>
        <div>
          <_Page />
        </div>
      </div>
    );
  }
}


module.exports = {
  View : View
};