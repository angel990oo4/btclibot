// const { NETWORKS } = require('../config/network');
const { getNeurons } = require('./query');
// const { api } = require('./api');

module.exports = {
  async realNeuron(apiCtx) {
    // if (api) {
    // const apiCtx = await api(NETWORKS[0].endpoints);
    const result = await getNeurons(apiCtx);
    console.log('result', result);

    const neurons = result.map((result) => {
      const neuron = result.value;
      return {
        hotkey: neuron.hotkey.toString(),
        coldkey: neuron.coldkey.toString(),
        stake: Number(neuron.stake),
        rank: Number(neuron.rank),
        trust: Number(neuron.trust),
        consensus: Number(neuron.consensus),
        incentive: Number(neuron.incentive),
        dividends: Number(neuron.dividends),
        emission: Number(neuron.emission),
        active: Boolean(neuron.active),
      };
    });
    return neurons;
    // }
  },
};
