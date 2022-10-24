const { NETWORKS } = require('../config/network');
const { getNeurons } = require('./query');
const { api } = require('./api');

module.exports = {
  async realNeuron() {
    const apiCtx = await api(NETWORKS[0].endpoints);
    const result = await getNeurons(apiCtx);
    const neurons = result.map((result) => {
      const neuron = result.value;
      return {
        hotkey: neuron.hotkey.toString(),
        coldkey: neuron.coldkey.toString(),
        stake: neuron.stake.toNumber(),
        uid: j + indexStart,
      };
    });
    return neurons;
  },
};
