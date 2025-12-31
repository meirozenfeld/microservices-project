const { AsyncLocalStorage } = require("async_hooks");

const requestContextStore = new AsyncLocalStorage();

function runWithContext(context, fn) {
  return requestContextStore.run(context, fn);
}

function getContext() {
  return requestContextStore.getStore();
}

module.exports = {
  runWithContext,
  getContext,
};
