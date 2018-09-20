class View extends React.Component {
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
        <div>This is from the base view.</div>
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