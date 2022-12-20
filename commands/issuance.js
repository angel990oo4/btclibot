const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

const { requestChain } = require('../utils/data');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('issuance')
    .setDescription('Total issuance'),

  async execute(interaction) {
    await interaction.deferReply({ ephemeral: false });
    requestChain()
      .then(async (res) => {
        const chainEmbed = new EmbedBuilder()
          .setColor('#4caf50')
          .setDescription(
            `The total issuance value is **${res?.data?.totalIssuance}**`
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
