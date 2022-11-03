const BtcliCommands =
  '**$btcli --help**: btcli commands list\n\
**$btcli stake [uid]**: The stake value for a given UID \n\
**$btcli inspect  [uid]**: Neuron info for a given UID \n\
**$btcli metagraph --raw**: The csv file of neuron info \n\
**$btcli incentive**: The plot of sorted incentive value \n\
**$btcli incentive --raw**: The csv file of incentive value \n\
**$btcli incentive --raw [--[ascending/descending]]**: The csv file of (optionally) sorted incentive values \n\
**$btcli emission**: The plot of sorted emission value \n\
**$btcli emission --raw**: The csv file of incentive value \n\
';

module.exports = {
  BtcliCommands,
};
