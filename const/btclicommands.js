const BtcliCommands =
  '**$btcli --help**: *btcli commands list*\n\
**$btcli stake --uid [uid]**: *The stake value for a given UID* \n\
**$btcli inspect --uid [uid]**: *Neuron info for a given UID* \n\
**$btcli metagraph --raw**: *The csv file of neuron info* \n\n\
**$btcli incentive**: T*he plot of sorted incentive value* \n\
**$btcli incentive --raw**: *The csv file of incentive value* \n\
**$btcli incentive --raw [--[ascending/descending]]**: *The csv file of (optionally) sorted incentive values* \n\
```Same commands for emission, rank, trust, consensus, dividends```\
';

module.exports = {
  BtcliCommands,
};
