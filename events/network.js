const wait = require('node:timers/promises').setTimeout;
const axios = require('axios');
let options = require('../store/option');

module.exports = {
  async execute(client, interaction) {
    if (interaction.customId === 'network') {
      const uids = interaction.values.map((item) => Number(item));
      await interaction.deferReply({ ephemeral: true });
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
          uid: [uids],
        })
        .then(async (res) => {
          if (
            res.data.response[0] === 'Error! Endpoint not available.' ||
            res.data.response[0] ===
              'Error! UID not synced, Request timeout.' ||
            res.data.response[0] === 'Error! Modality not implemented.'
          ) {
            await interaction.editReply(`${res.data.response[0]}`);
          } else {
            const channel = client.channels.cache.get('1032368418902519841');
            channel.send(`${res.data.response[0]}`);
            await interaction.editReply('Sent a message successfully');
          }
        })
        .catch(async (err) => {
          await interaction.editReply(`${err}`);
          console.log('err', err);
        });
    }
  },
};
