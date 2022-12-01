const { BtcliCommands, GenerateOptions } = require('../const/btclicommands');
const { EmbedBuilder } = require('discord.js');

module.exports = {
  async helpExecute(msg, type) {
    switch (type) {
      case 'generate': {
        const generateEmbed = new EmbedBuilder()
          .setColor('#03a9f4')
          .setTitle('Generate Help Menu')
          .setDescription(`${GenerateOptions}`);
        msg.channel.send({
          embeds: [generateEmbed],
        });
        break;
      }
      default:
        const helperEmbed = new EmbedBuilder()
          .setColor('#03a9f4')
          .setTitle('Btcli Commands')
          .setDescription(`${BtcliCommands}`);
        msg.channel.send({
          embeds: [helperEmbed],
        });
        break;
    }
  },
};
