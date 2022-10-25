const { WsProvider } = require('@polkadot/rpc-provider/ws');
const { ApiPromise } = require('@polkadot/api/promise/Api');

module.exports = {
  async api(endpoints) {
    try {
      const backupProvider = new WsProvider(endpoints);
      const api = ApiPromise.create({ provider: backupProvider })
        .then((api) => {
          return api;
        })
        .catch((err) => {
          return null;
        });
      return api;
    } catch (err) {
      return null;
    }
  },
};
