const { ChartJSNodeCanvas } = require('chartjs-node-canvas');
const { AttachmentBuilder } = require('discord.js');
module.exports = {
  async generateIncentiveFile() {
    const message = await msg.channel.send({ content: 'loading data...' });
    requestData()
      .then(async (res) => {
        await message.delete();
        let NeuronData = res?.data?.neuron;
        const csvContent = NeuronData.sort(function (a, b) {
          return b.incentive - a.incentive;
        })
          .map((neuron, index) =>
            [
              `${neuron.uid}`,
              `${neuron.incentive / 18446744073709551615}`,
            ].join(',')
          )
          .join('\n');
        const buffer = Buffer.from(csvContent, 'utf-8');
        const file = new AttachmentBuilder(buffer, {
          name: 'uid_incentive_descending.csv',
        });
        msg.channel.send({
          content: 'Incentive raw value',
          files: [file],
        });
      })
      .catch((err) => {
        msg.channel.send({
          content: `${err}`,
        });
      });
  },
};
