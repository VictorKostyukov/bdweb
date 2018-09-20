const View = require("../View.jsx").View;


class SystemHomeView extends View {
  constructor(props) {
    super(props);
  }


  onRender() {
    return (
      <div>
        This is message from {this.type}: {this.model}
      </div>
    );
  }
}


module.exports = {
  SystemHomeView : SystemHomeView
};