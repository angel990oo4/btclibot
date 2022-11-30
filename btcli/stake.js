const { requestData } = require('../utils/data');
const { validUID } = require('../utils/utils');
const { EmbedBuilder } = require('discord.js');

module.exports = {
  async stakeExecute(uid, msg) {
    if (!validUID(uid)) {
      const errorEmbed = new EmbedBuilder()
        .setColor(0xee0000)
        .setDescription(`⚠️ UID should be an integer between 0 and 4095`);
      msg.channel.send({
        embeds: [errorEmbed],
      });
    } else {
      const message = await msg.channel.send({ content: 'loading data...' });
      requestData()
        .then(async (NeuronData) => {
          await message.delete();
          if (NeuronData?.data?.neuron?.[Number(uid)]?.stake) {
            const stakeEmbed = new EmbedBuilder().setDescription(
              `UID:**${uid}** has **τ${
                NeuronData?.data?.neuron?.[Number(uid)].stake / 1000000000
              }** staked `
            );
            msg.channel.send({ embeds: [stakeEmbed] });
          } else {
            msg.channel.send({ content: `No data` });
          }
        })
        .catch(async (err) => {
          console.log('err', err);
          await message.delete();
          msg.channel.send({ content: `No data found ` });
        });
    }
  },
};
