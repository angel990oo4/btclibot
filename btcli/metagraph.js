const { requestData } = require('../utils/data');
const { AttachmentBuilder } = require('discord.js');
const { EmbedBuilder } = require('discord.js');

module.exports = {
  async metagraphExecuteRaw(msg, order) {
    const message = await msg.channel.send({
      content: 'loading data...',
    });
    requestData()
      .then(async (res) => {
        await message.delete();
        let NeuronData = res?.data?.neuron;
        let csvContent = NeuronData.map((neuron, index) =>
          [
            `${neuron.uid}`,
            `${neuron.hotkey}`,
            `${neuron.coldkey}`,
            `${neuron.stake / 1000000000}`,
            `${neuron.rank / 18446744073709551615}`,
            `${neuron.trust / 18446744073709551615}`,
            `${neuron.consensus / 18446744073709551615}`,
            `${neuron.incentive / 18446744073709551615}`,
            `${neuron.dividends / 18446744073709551615}`,
            `${neuron.emission / 1000000000}`,
            `${neuron.active}`,
          ].join(', ')
        );
        csvContent.unshift(
          'UID, HotKey, ColdKey, Stake, Rank, Trust, Consensus, Incentive, Dividends, Emission, Active'
        );
        csvContent = csvContent.join('\n');
        const buffer = Buffer.from(csvContent, 'utf-8');
        const file = new AttachmentBuilder(buffer, {
          name: 'metagraph.csv',
        });
        const metagraphEmbed = new EmbedBuilder().setDescription(
          `Metagraph raw value`
        );
        msg.channel.send({
          embeds: [metagraphEmbed],
          files: [file],
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
