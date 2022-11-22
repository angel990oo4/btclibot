const { BtcliCommands } = require('../const/btclicommands');
const { EmbedBuilder } = require('discord.js');

module.exports = {
  async helpExecute(msg) {
    const helperEmbed = new EmbedBuilder()
      .setTitle('Btcli Commands')
      .setDescription(`${BtcliCommands}`);
    msg.channel.send({
      embeds: [helperEmbed],
    });
  },
};
