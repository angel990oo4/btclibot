const { SlashCommandBuilder } = require('discord.js');
const wait = require('node:timers/promises').setTimeout;

module.exports = {
  data: new SlashCommandBuilder()
    .setName('block')
    .setDescription('Querying the latest block number!'),

  async execute(interaction) {
    await interaction.deferReply({ ephemeral: true });
    await interaction.editReply(`Current block number`);
  },
};
