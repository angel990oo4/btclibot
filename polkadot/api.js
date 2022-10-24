const { WsProvider } = require('@polkadot/rpc-provider/ws');
const { ApiPromise } = require('@polkadot/api/promise/Api');

module.exports = {
  async api(endpoints) {
    try {
      const backupProvider = new WsProvider(endpoints);
      await backupProvider.connect();
      const backupapi = await ApiPromise.create({
        provider: backupProvider,
      });
      return backupapi;
    } catch (err) {
      return null;
    }
  },
};
