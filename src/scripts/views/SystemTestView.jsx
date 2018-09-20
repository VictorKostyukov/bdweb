const View = require("../View.jsx").View;


class SystemTestView extends View {
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
  SystemTestView : SystemTestView
};