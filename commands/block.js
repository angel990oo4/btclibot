const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

const { requestChain } = require('../utils/data');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('block')
    .setDescription('Querying the latest block number!'),

  async execute(interaction) {
    await interaction.deferReply({ ephemeral: false });
    requestChain()
      .then(async (res) => {
        const chainEmbed = new EmbedBuilder()
          .setColor('#4caf50')
          .setDescription(
            `The current block number is **${res?.data?.block}**`
          );

        await interaction.editReply({ embeds: [chainEmbed] });
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
