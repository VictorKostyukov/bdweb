#! /usr/bin/env node

const Config = require("./Config.js").Config;
const RemoteCall = require("./RemoteCall.js").RemoteCall;
const except = require("./Exception.js");

class ContractProvider {
  constructor() {
  }


  async newAccount() {
    return await this.__call("/api/eos/Account/NewAccount");
  }


  async getBalance(account) {
    return await this.__call("/api/eos/Account/GetBalance", { account : account });
  }


  async issueTokens(account, amount) {
    return await this.__call("/api/eos/Account/IssueTokens", { account : account, amount : amount });
  }


  async transferTokens(from, to, amount) {
    return await this.__call("/api/eos/Account/TransferTokens", { from : from, to : to, amount : amount });
  }


  async __call(method, args) {
    let action = new RemoteCall(`${Config.contractProvider}${method}`, args);
    action.timeout = Config.contractConnectTimeout;
    let task = await action.invoke();

    let result = new RemoteCall(`${Config.contractProvider}/api/eos/Task/GetResult`, { id : task.Id });
    result.timeout = Config.contractActionTimeout;
    let now = Math.floor(Date.now() / 1000);
    let timeout = now + result.timeout;

    return new Promise((resolve, reject) => {
      let invoke = () => {
        result.invoke()
          .then(rtn => {
            if (rtn.Type === "Error") {
              if (rtn.Code === 401) { // ERR_TASK_NOT_COMPLETE
                now = Math.floor(Date.now() / 1000);
                if (now < timeout) {
                  setTimeout(invoke, 1000);
                } else {
                  reject(new except.TaskNotCompleteException());
                }
              } else {
                reject(new except.TaskFailureException(rtn.Message));
              }
            } else {
              resolve(rtn);
            }
          })
          .catch(ex => {
            reject(ex);
          });
      };

      invoke();
    });
  }
}


const provider = new ContractProvider();

module.exports = provider;