const {
    SlashCommandBuilder,
    ActionRowBuilder,
    SelectMenuBuilder,
    ModalBuilder,
    TextInputBuilder,
    TextInputStyle,
  } = require("discord.js");
  const wait = require("node:timers/promises").setTimeout;
  
  module.exports = {
    data: new SlashCommandBuilder()
      .setName("btcli")
      .setDescription("Bittensor discord cli"),
  
      async execute(interaction) {
        await interaction.reply('Pong')
    }
  };
  