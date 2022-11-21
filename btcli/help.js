const { BtcliCommands } = require('../const/btclicommands');
const {
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
  EmbedBuilder,
  Events,
  TextInputBuilder,
} = require('discord.js');

module.exports = {
  async helpExecute(msg) {
    const embed = new EmbedBuilder()
      .setColor(0x0099ff)
      .setTitle('Some title')
      .setURL('https://discord.js.org')
      .setDescription(`${BtcliCommands}`);
    const input = new TextInputBuilder()
      // set the maximum number of characters to allow
      .setMaxLength(1000)
      // set the minimum number of characters required for submission
      .setMinLength(10)
      // set a placeholder string to prompt the user
      .setPlaceholder('Enter some text!')
      // set a default value to pre-fill the input
      .setValue('Default')
      // require a value in this input field
      .setRequired(true);
    const row = new ActionRowBuilder().addComponents(
      new ButtonBuilder()
        .setCustomId('primary')
        .setLabel('Click me!')
        .setStyle(ButtonStyle.Primary)
    );

    msg.channel.send({
      content: `${BtcliCommands}`,
      embeds: [embed],
      components: [row],
      ephemeral: true,
    });
  },
};
