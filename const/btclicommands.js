const BtcliCommands =
  '**$btcli --help**: btcli commands list\n\
**$btcli stake --uid [uid]**: The stake value for a given UID \n\
`  Example: $btcli stkae --uid 5  `\n\
**$btcli inspect --uid [uid]**: Neuron info for a given UID \n\
`  Example: $btcli inspect --uid 5  `\n\
**$btcli metagraph --raw**: The csv file of neuron info \n\n\
**$btcli incentive**: The plot of sorted incentive value \n\
**$btcli incentive --raw**: The csv file of incentive value \n\
**$btcli incentive --raw [--[ascending/descending]]**: The csv file of (optionally) sorted incentive values \n\
`  Example: $btcli incentive --raw --ascending  `\n\
**$btcli incentive --uid [uid] --range [days]**: The incentive values of a certain uid for last days \n\
`  Example: $btcli incentive --uid 5 --range 5 `\n\
Same commands for `emission`, `rank`, `trust`, `consensus`, `dividends`, `stake`\n\n\
**$btcli block**: Current block number\n\
**$btcli difficulty**: Difficulty value\n\
**$btcli issuance**: Total issuance\n\
**$btcli next_halving**: The left time until next halving\n\
';
// **$btcli generate [options]**: Bittensor reponse\n\
// Type **$btcli help generate** to see the options\n\

const GenerateOptions =
  '**--prompt [prompt]** (Default: I am a btcli bot)\n\
  **--do_sample [do_sample]** (Default: true)\n\
  **--early_stopping [early_stopping]** (Default: false)\n\
  **--no_repeat_ngram_size [no_repeat_ngram_size]** (Default: 2)\n\
  **--num_beams [num_beams]** (Default: 5)\n\
  **--num_return_sequences [num_return_sequences]** (Default: 1)\n\
  **--num_to_generate [num_to_generate]** (Default: 64)\n\
  **--top_p [top_p]** (Default: 0.95)\n\
  **--topk [topk]** (Default: 512)\n\
  **--uid [uid]** (Default: 80)\n\
  **--network [nakamoto/nobunaga]** (Default: nakamoto)\n\
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
  GenerateOptions,
  factors,
  chain,
};
