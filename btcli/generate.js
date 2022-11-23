const axios = require('axios');
let { options, paramOptions } = require('../store/option');

module.exports = {
  async generateExecute(msg, messageArray) {
    console.log('messageArray', messageArray);
    const message = await msg.channel.send({
      content: 'loading data...',
    });
    let optionsInstance = Object.assign({}, options);
    let optionItem = '';
    let paramDetected = false;
    for (i = 2; i < messageArray.length; i++) {
      if (paramOptions.includes(messageArray[i])) {
        optionItem = messageArray[i].slice(2);
        optionsInstance[optionItem] = '';
        paramDetected = true;
      } else if (paramDetected) {
        if (!!optionsInstance[optionItem])
          optionsInstance[optionItem] = optionsInstance[optionItem].concat(
            ' ',
            messageArray[i]
          );
        else
          optionsInstance[optionItem] = optionsInstance[optionItem].concat(
            messageArray[i]
          );
      } else {
        await message.delete();
        msg.channel.send({
          content: 'Please specify the correct options',
        });
        return;
      }
    }

    await axios
      .post('https://playground-api.bittensor.com/seq2seq', {
        do_sample: optionsInstance.do_sample,
        early_stopping: optionsInstance.early_stopping,
        network: optionsInstance.network,
        no_repeat_ngram_size: Number(optionsInstance.no_repeat_ngram_size),
        num_beams: Number(optionsInstance.num_beams),
        num_return_sequences: Number(optionsInstance.num_return_sequences),
        num_to_generate: Number(optionsInstance.num_to_generate),
        prompt: optionsInstance.prompt,
        top_p: Number(optionsInstance.top_p),
        topk: Number(optionsInstance.topk),
        uid: optionsInstance.uid.split(',').map((i) => Number(i)),
      })
      .then(async (res) => {
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
