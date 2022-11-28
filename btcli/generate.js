const axios = require('axios');
let { options, paramOptions } = require('../store/option');

module.exports = {
  async generateExecute(msg, messageArray) {
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
          content:
            'Please specify the correct options:\n\
            [--prompt]:string (I am a btcli bot)\n\
            [--do_sample]:boolean (true)\n\
            [--early_stopping]:boolean (false)\n\
            [--no_repeat_ngram_size]:number (2)\n\
            [--num_beams]:number (5)\n\
            [--num_return_sequences]:number (1)\n\
            [--num_to_generate]:number (64)\n\
            [--top_p]:number (0.95)\n\
            [--topk]:number (512)\n\
            [--uid]:number (80)\n\
            [--network]:nakamoto||nobunaga (nakamoto)\n\
            ',
        });
        return;
      }
    }

    await axios
      .post('https://playground-api.bittensor.com/seq2seq', {
        do_sample: optionsInstance.do_sample === 'true' ? true : false,
        early_stopping:
          optionsInstance.early_stopping === 'true' ? true : false,
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
          let result = res.data.response[0].split('\n');
          // msg.channel.send({
          //   content: `Prompt: ${result[0]}\nResponse: ${result.slice(1)}`,
          // });
          msg.channel.send({
            content: `Prompt: ${optionsInstance.prompt}\nResponse: ${res.data.response[0]}`,
          });
        }
      })
      .catch(async (err) => {
        await message.delete();
        console.log('ERROR', err);
        msg.channel.send({
          content: `No data found`,
        });
      });
  },
};
