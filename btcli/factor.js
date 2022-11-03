const { requestData } = require('../utils/data');
const { generateCanva } = require('../utils/chartNeuron');
const { AttachmentBuilder } = require('discord.js');

module.exports = {
  async factorExecute(msg, factor) {
    let title = factor.toUpperCase();
    const message = await msg.channel.send({
      content: 'loading data...',
    });
    requestData()
      .then(async (res) => {
        await message.delete();
        let NeuronData = res?.data?.neuron;
        let labels = Array.from(new Array(4096), (x, i) => i);
        let data = NeuronData.map((neuron, index) => {
          if (factor === 'emission' || factor === 'stake') {
            return neuron[factor] / 1000000000;
          } else return neuron[factor] / 1844674407.3709551615 / 1000000000;
        });
        const attachment = await generateCanva(
          labels,
          data.sort(function (a, b) {
            return a - b;
          }),
          (title = title)
        );
        chartEmbed = {
          title: 'MessageEmbed title',
          image: {
            url: 'attachment://graph.png',
          },
        };
        msg.channel.send({
          content: `${title} value`,
          files: [attachment],
        });
      })
      .catch((err) => {
        msg.channel.send({
          content: `${err}`,
        });
      });
  },

  async factorExecuteRaw(msg, order, factor) {
    let title = factor.toUpperCase();
    const message = await msg.channel.send({
      content: 'loading data...',
    });
    requestData()
      .then(async (res) => {
        await message.delete();
        let NeuronData = res?.data?.neuron;
        let csvContent;
        switch (order) {
          case '--ascending':
            csvContent = NeuronData.sort(function (a, b) {
              return a[factor] - b[factor];
            })
              .map((neuron, index) => {
                if (factor === 'emission' || factor === 'stake') {
                  return [
                    `${neuron.uid}`,
                    `${neuron[factor] / 1000000000}`,
                  ].join(',');
                } else
                  return [
                    `${neuron.uid}`,
                    `${neuron[factor] / 1844674407.3709551615 / 1000000000}`,
                  ].join(',');
              })
              .join('\n');
            break;
          case '--descending':
            csvContent = NeuronData.sort(function (a, b) {
              return b[factor] - a[factor];
            })
              .map((neuron, index) => {
                if (factor === 'emission' || factor === 'stake') {
                  return [
                    `${neuron.uid}`,
                    `${neuron[factor] / 1000000000}`,
                  ].join(',');
                } else
                  return [
                    `${neuron.uid}`,
                    `${neuron[factor] / 1844674407.3709551615 / 1000000000}`,
                  ].join(',');
              })
              .join('\n');
            break;
          default:
            csvContent = NeuronData.map((neuron, index) => {
              if (factor === 'emission' || factor === 'stake') {
                return [`${neuron.uid}`, `${neuron[factor] / 1000000000}`].join(
                  ','
                );
              } else
                return [
                  `${neuron.uid}`,
                  `${neuron[factor] / 1844674407.3709551615 / 1000000000}`,
                ].join(',');
            }).join('\n');
            break;
        }
        const buffer = Buffer.from(csvContent, 'utf-8');
        const file = new AttachmentBuilder(buffer, {
          name: `uid_${factor}.csv`,
        });
        msg.channel.send({
          content: `${title} raw value`,
          files: [file],
        });
      })
      .catch((err) => {
        msg.channel.send({
          content: `'${err}`,
        });
      });
  },
};
