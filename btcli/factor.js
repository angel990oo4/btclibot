const { requestData, requestHistory } = require('../utils/data');
const { generateCanva } = require('../utils/chartNeuron');
const { AttachmentBuilder, EmbedBuilder } = require('discord.js');

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
      .catch(async (err) => {
        await message.delete();
        console.log('ERROR', err);
        msg.channel.send({
          content: `No data found`,
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
          case '—ascending':
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
          case '—descending':
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
      .catch(async (err) => {
        await message.delete();
        console.log('ERROR', err);
        msg.channel.send({
          content: `No data found`,
        });
      });
  },

  async factorHistoryExecute(msg, factor, uid, range) {
    const message = await msg.channel.send({
      content: 'loading data...',
    });
    requestHistory({ uid: uid, range: range, factor: factor })
      .then(async (res) => {
        await message.delete();
        // let title = factor.toUpperCase();
        let title = `The ${factor} values of uid ${uid} for last ${range} days`;
        let labels = Array.from(new Array(parseInt(range)), (x, i) => i);
        let data = [];
        Object.keys(res.data).forEach((k, i) => {
          data.push(res.data[k][uid][factor]);
        });
        const attachment = await generateCanva(labels, data, title);
        chartEmbed = {
          title: 'MessageEmbed title',
          image: {
            url: 'attachment://graph.png',
          },
        };
        const factorEmbed = new EmbedBuilder().setDescription(
          `The ${factor} values of uid ${uid} for last ${range} days`
        );
        msg.channel.send({
          embeds: [factorEmbed],
          files: [attachment],
        });
      })
      .catch(async (err) => {
        await message.delete();
        console.log('ERROR', err);
        msg.channel.send({
          content: `No data found`,
        });
      });
  },
};
