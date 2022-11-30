const { BtcliCommands, GenerateOptions } = require('../const/btclicommands');
const { EmbedBuilder } = require('discord.js');

module.exports = {
  async helpExecute(msg, type) {
    switch (type) {
      case 'generate': {
        const generateEmbed = new EmbedBuilder()
          .setTitle('Generate Help Menu')
          .setDescription(`${GenerateOptions}`);
        msg.channel.send({
          embeds: [generateEmbed],
        });
        break;
      }
      default:
        const helperEmbed = new EmbedBuilder()
          .setTitle('Btcli Commands')
          .setDescription(`${BtcliCommands}`);
        msg.channel.send({
          embeds: [helperEmbed],
        });
        break;
    }
  },
};
