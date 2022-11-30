const { requestChain } = require('../utils/data');
const { EmbedBuilder } = require('discord.js');

module.exports = {
  async chainParameterExecute(msg, params) {
    const message = await msg.channel.send({
      content: 'loading data...',
    });
    requestChain()
      .then(async (res) => {
        await message.delete();
        let data = '';
        switch (params) {
          case 'block':
            data = `The current block number is **${res?.data?.block}**`;
            break;
          case 'difficulty':
            data = `The difficulty value is **${
              res?.data?.difficulty / 1000000000000
            }T**`;
            break;
          case 'issuance':
            data = `The total issuance value is **${res?.data?.totalIssuance}**`;
            break;
          case 'next_halving':
            data = `**${((10500000 - Number(res?.data?.block)) / 7200)
              .toFixed(1)
              .toString()}** days are left until next halving`;
            break;
          default:
            break;
        }
        const chainEmbed = new EmbedBuilder().setDescription(`${data}`);
        msg.channel.send({
          embeds: [chainEmbed],
        });
      })
      .catch(async (err) => {
        await message.delete();
        console.log('ERROR', err);
        const errorEmbed = new EmbedBuilder()
          .setColor(0xee0000)
          .setDescription(`⚠️ No data found`);
        msg.channel.send({ embeds: [errorEmbed] });
      });
  },
};
