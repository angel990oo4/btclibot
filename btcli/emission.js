const { requestData } = require('../utils/data');
const { generateCanva } = require('../btcli/chartNeuron');
const { AttachmentBuilder } = require('discord.js');

module.exports = {
  async emissionExecute(msg) {
    const message = await msg.channel.send({
      content: 'loading data...',
    });
    requestData()
      .then(async (res) => {
        await message.delete();
        let NeuronData = res?.data?.neuron;
        let labels = Array.from(new Array(4096), (x, i) => i);
        let data = NeuronData.map(
          (neuron, index) => neuron.emission / 1000000000
        );
        const attachment = await generateCanva(
          labels,
          data.sort(function (a, b) {
            return a - b;
          }),
          (title = 'Emission')
        );
        chartEmbed = {
          title: 'MessageEmbed title',
          image: {
            url: 'attachment://graph.png',
          },
        };
        msg.channel.send({
          content: 'Emission value',
          files: [attachment],
        });
      })
      .catch((err) => {
        msg.channel.send({
          content: `${err}`,
        });
      });
  },

  async emissionExecuteRaw(msg) {
    const message = await msg.channel.send({
      content: 'loading data...',
    });
    requestData()
      .then(async (res) => {
        await message.delete();
        let NeuronData = res?.data?.neuron;
        const csvContent = NeuronData.map((neuron, index) =>
          [`${neuron.uid}`, `${neuron.emission / 1000000000}`].join(',')
        ).join('\n');
        const buffer = Buffer.from(csvContent, 'utf-8');
        const file = new AttachmentBuilder(buffer, {
          name: 'uid_emission.csv',
        });
        msg.channel.send({
          content: 'Emission raw value',
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
