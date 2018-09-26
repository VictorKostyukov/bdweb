const View = require("../View.jsx").View;


class SystemHomeView extends View {
  constructor(props) {
    super(props);
  }


  onRender() {
    return (
      <div>
        This is message from {this.model.page}: {this.model.message}
      </div>
    );
  }
}


module.exports = {
  SystemHomeView : SystemHomeView
};