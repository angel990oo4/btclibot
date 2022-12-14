const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

const { requestChain } = require('../utils/data');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('difficulty')
    .setDescription('Querying the difficulty'),

  async execute(interaction) {
    await interaction.deferReply({ ephemeral: true });
    requestChain()
      .then(async (res) => {
        const chainEmbed = new EmbedBuilder()
          .setColor('#4caf50')
          .setDescription(
            `The difficulty value is **${
              res?.data?.difficulty / 1000000000000
            }**`
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
