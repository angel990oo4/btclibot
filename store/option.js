const options = {
  do_sample: 'true',
  early_stopping: 'false',
  network: 'nakamoto',
  no_repeat_ngram_size: '2',
  num_beams: '5',
  num_return_sequences: '1',
  num_to_generate: '64',
  prompt: 'I am a btcli bot',
  top_p: '0.95',
  topk: '512',
  uid: '80',
};

const paramOptions = [
  '--do_sample',
  '--early_stopping',
  '--network',
  '--no_repeat_ngram_size',
  '--num_beams',
  '--num_return_sequences',
  '--num_to_generate',
  '--prompt',
  '--top_p',
  '--topk',
  '--uid',
];

module.exports = {
  options,
  paramOptions,
};
