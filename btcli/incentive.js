const { requestData } = require('../utils/data');
const { generateCanva } = require('../utils/chartNeuron');
const { AttachmentBuilder } = require('discord.js');

module.exports = {
  async incentiveExecute(msg) {
    const message = await msg.channel.send({
      content: 'loading data...',
    });
    requestData()
      .then(async (res) => {
        await message.delete();
        let NeuronData = res?.data?.neuron;
        let labels = Array.from(new Array(4096), (x, i) => i);
        let data = NeuronData.map(
          (neuron, index) => neuron.incentive / 18446744073709551615
        );
        const attachment = await generateCanva(
          labels,
          data.sort(function (a, b) {
            return a - b;
          }),
          (title = 'Incentive')
        );
        chartEmbed = {
          title: 'MessageEmbed title',
          image: {
            url: 'attachment://graph.png',
          },
        };
        msg.channel.send({
          content: 'Incentive value',
          files: [attachment],
        });
      })
      .catch((err) => {
        msg.channel.send({
          content: `${err}`,
        });
      });
  },

  async incentiveExecuteRaw(msg, order) {
    const message = await msg.channel.send({
      content: 'loading data...',
    });
    requestData()
      .then(async (res) => {
        await message.delete();
        let NeuronData = res?.data?.neuron;
        let csvContent;
        switch (order) {
          case 'ascending':
            csvContent = NeuronData.sort(function (a, b) {
              return a.incentive - b.incentive;
            })
              .map((neuron, index) =>
                [
                  `${neuron.uid}`,
                  `${neuron.incentive / 18446744073709551615}`,
                ].join(',')
              )
              .join('\n');
            break;
          case 'descending':
            csvContent = NeuronData.sort(function (a, b) {
              return b.incentive - a.incentive;
            })
              .map((neuron, index) =>
                [
                  `${neuron.uid}`,
                  `${neuron.incentive / 18446744073709551615}`,
                ].join(',')
              )
              .join('\n');
            break;
          default:
            csvContent = NeuronData.map((neuron, index) =>
              [
                `${neuron.uid}`,
                `${neuron.incentive / 18446744073709551615}`,
              ].join(',')
            ).join('\n');
            break;
        }
        const buffer = Buffer.from(csvContent, 'utf-8');
        const file = new AttachmentBuilder(buffer, {
          name: 'uid_incentive.csv',
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
