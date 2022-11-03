const { requestData } = require('../utils/data');
const { generateCanva } = require('../btcli/chartNeuron');

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
};
