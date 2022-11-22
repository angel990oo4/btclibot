const BtcliCommands =
  '**$btcli --help**: btcli commands list\n\
**$btcli stake --uid [uid]**: The stake value for a given UID \n\
**$btcli inspect --uid [uid]**: Neuron info for a given UID \n\
**$btcli metagraph --raw**: The csv file of neuron info \n\n\
**$btcli incentive**: The plot of sorted incentive value \n\
**$btcli incentive --raw**: The csv file of incentive value \n\
**$btcli incentive --raw [--[ascending/descending]]**: The csv file of (optionally) sorted incentive values \n\
Same commands for emission, rank, trust, consensus, dividends\n\n\
**$btcli block**: Current block number\n\
**$btcli difficulty**: Difficulty value\n\
**$btcli issuance**: Total issuance\n\
**$btcli next_halving**: The left time until next halving\n\
**$btcli generate**: Bittensor reponse bot\n\
';

const factors = [
  'stake',
  'incentive',
  'emission',
  'rank',
  'trust',
  'consensus',
  'dividends',
];
const chain = ['block', 'difficulty', 'issuance', 'next_halving'];
module.exports = {
  BtcliCommands,
  factors,
  chain,
};
