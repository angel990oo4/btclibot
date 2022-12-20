const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const axios = require('axios');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('generate')
    .setDescription('Test a model')
    .addStringOption((option) =>
      option.setName('--prompt').setDescription('I am a btcli bot')
    )
    .addStringOption((option) => option.setName('--uid').setDescription('80'))
    .addStringOption((option) =>
      option.setName('--network').setDescription('nakamoto')
    )
    .addStringOption((option) =>
      option.setName('--no_repeat_ngram_size').setDescription('2')
    )
    .addStringOption((option) =>
      option.setName('--num_beams').setDescription('5')
    )
    .addStringOption((option) =>
      option.setName('--num_return_sequences').setDescription('1')
    )
    .addStringOption((option) =>
      option.setName('--num_to_generate').setDescription('5')
    )
    .addStringOption((option) =>
      option.setName('--top_p').setDescription('0.95')
    )
    .addStringOption((option) => option.setName('--topk').setDescription('512'))
    .addStringOption((option) =>
      option.setName('--do_sample').setDescription('true')
    )
    .addStringOption((option) =>
      option.setName('--early_stopping').setDescription('false')
    ),

  async execute(interaction) {
    await interaction.deferReply({ ephemeral: false });
    const prompt =
      interaction.options.getString('--prompt') ?? 'I am a btcli bot';
    const uid = interaction.options.getString('--uid') ?? '80';
    const network = interaction.options.getString('--network') ?? 'nakamoto';
    const no_repeat_ngram_size =
      interaction.options.getString('--no_repeat_ngram_size') ?? '2';
    const num_beams = interaction.options.getString('--num_beams') ?? '5';
    const num_return_sequences =
      interaction.options.getString('--num_return_sequences') ?? '1';
    const num_to_generate =
      interaction.options.getString('--num_to_generate') ?? '5';
    const top_p = interaction.options.getString('--top_p') ?? '0.95';
    const topk = interaction.options.getString('--topk') ?? '512';
    const do_sample = interaction.options.getString('--do_sample') ?? 'true';
    const early_stopping =
      interaction.options.getString('--early_stopping') ?? 'false';

    await axios
      .post('https://playground-api.bittensor.com/seq2seq', {
        do_sample: do_sample === 'true' ? true : false,
        early_stopping: early_stopping === 'true' ? true : false,
        network: network,
        no_repeat_ngram_size: Number(no_repeat_ngram_size),
        num_beams: Number(num_beams),
        num_return_sequences: Number(num_return_sequences),
        num_to_generate: Number(num_to_generate),
        prompt: prompt,
        top_p: Number(top_p),
        topk: Number(topk),
        uid: uid.split(',').map((i) => Number(i)),
      })
      .then(async (res) => {
        if (
          res.data.response[0] === 'Error! Endpoint not available.' ||
          res.data.response[0] === 'Error! UID not synced, Request timeout.' ||
          res.data.response[0] === 'Error! Modality not implemented.'
        ) {
          console.log('ERROR', res.data.response[0]);
          const errorEmbed = new EmbedBuilder()
            .setColor(0xee0000)
            .setDescription(`⚠️ No data found`);
          await interaction.editReply({ embeds: [errorEmbed] });
        } else {
          await interaction.editReply({
            content: `Prompt: ${prompt}\nResponse: ${res.data.response[0]}`,
          });
        }
      })
      .catch(async (err) => {
        console.log('ERROR', err);
        const errorEmbed = new EmbedBuilder()
          .setColor(0xee0000)
          .setDescription(`⚠️ No data found`);
        await interaction.editReply({ embeds: [errorEmbed] });
      });
  },
};
