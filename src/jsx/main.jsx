class TestButton extends React.Component {
  constructor(props) {
    super(props);
    this.state = { value : "hello" };
  }

  render() {
    return (
      <button onClick={() => this.setState({ value : "world!" })}>
        { this.state.value }
      </button>
    );
  }
}


class UI {
  constructor() {
  }

  static Init() {
    ReactDOM.render(
      React.createElement(TestButton),
      document.getElementById("main")
    );
  }
}

