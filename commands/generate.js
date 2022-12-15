const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

const { requestData } = require('../utils/data');

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
    await interaction.deferReply({ ephemeral: true });
    const uid = '0';
    requestData()
      .then(async (NeuronData) => {
        if (NeuronData?.data?.neuron?.[Number(uid)]?.stake) {
          const stakeEmbed = new EmbedBuilder()
            .setColor('#4caf50')
            .setDescription(
              `UID:**${uid}** has **τ${
                NeuronData?.data?.neuron?.[Number(uid)].stake / 1000000000
              }** staked `
            );
          await interaction.editReply({ embeds: [stakeEmbed] });
        } else {
          const errorEmbed = new EmbedBuilder()
            .setColor(0xee0000)
            .setDescription(`⚠️ No data found`);
          await interaction.editReply({ embeds: [errorEmbed] });
        }
      })
      .catch(async (err) => {
        console.log('err', err);
        await message.delete();
        const errorEmbed = new EmbedBuilder()
          .setColor(0xee0000)
          .setDescription(`⚠️ No data found`);
        await interaction.editReply({ embeds: [errorEmbed] });
      });
  },
};
