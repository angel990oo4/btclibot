const axios = require('axios');
let options = require('../store/option');

module.exports = {
  async generateExecute(msg, messageArray) {
    const message = await msg.channel.send({
      content: 'loading data...',
    });
    await axios
      .post('https://playground-api.bittensor.com/seq2seq', {
        do_sample: options.do_sample,
        early_stopping: options.early_stopping,
        network: options.network,
        no_repeat_ngram_size: Number(options.no_repeat_ngram_size),
        num_beams: Number(options.num_beams),
        num_return_sequences: Number(options.num_return_sequences),
        num_to_generate: Number(options.num_to_generate),
        prompt: options.prompt,
        top_p: Number(options.top_p),
        topk: Number(options.topk),
        uid: options.uid,
      })
      .then(async (res) => {
        console.log('res', res.data);
        await message.delete();
        if (
          res.data.response[0] === 'Error! Endpoint not available.' ||
          res.data.response[0] === 'Error! UID not synced, Request timeout.' ||
          res.data.response[0] === 'Error! Modality not implemented.'
        ) {
          msg.channel.send({
            content: `${res.data.response[0]}`,
          });
        } else {
          msg.channel.send({
            content: `${res.data.response[0]}`,
          });
        }
      })
      .catch(async (err) => {
        msg.channel.send({
          content: `${err}`,
        });
        console.log('err', err);
      });
  },
};
