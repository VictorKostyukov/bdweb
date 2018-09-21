const View = require("../common/View.js").View;
const NotSupportedException = require("../common/Exception.js").NotSupportedException;

class SystemSecurityView extends View {
  constructor(api) {
    super(api);
  }


  model() {
    throw new NotSupportedException();
  }


  SignUp() {
    return this.__render({
      view : {
        navigationBar : { hidden : true },
        noContainer : true
      }
    });
  }


  Login() {
    return this.__render({
      view : {
        navigationBar : { hidden : true },
        noContainer : true
      }
    });
  }
}


module.exports = {
  SystemSecurityView : SystemSecurityView
};
