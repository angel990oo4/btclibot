const {
    SlashCommandBuilder,
    ActionRowBuilder,
    SelectMenuBuilder,
    ModalBuilder,TextInputBuilder,
    TextInputStyle,
  } = require("discord.js");
  const wait = require("node:timers/promises").setTimeout;
  
  module.exports = {
    data: new SlashCommandBuilder()
      .setName("btcli")
      .setDescription("Bittensor Discord Cli")
      .addStringOption(option =>
        option.setName('mechanism')
            .setDescription('command')
            .setRequired(true)
            .addChoices({ name: 'Stake', value: 'stake' }))
      .addStringOption(option =>
        option.setName('uid')
            .setDescription('UID for Stake value')
            .setRequired(true)),


      async execute(interaction) {
        await interaction.reply('Pong')
    }
  };
  