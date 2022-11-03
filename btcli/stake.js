const { requestData } = require('../utils/data');
const { validUID } = require('../utils/utils');

module.exports = {
  async stakeExecute(uid, msg) {
    if (!validUID(uid)) {
      msg.channel.send({
        content: `*UID should be an integer between 0 and 4095*`,
      });
    } else {
      const message = await msg.channel.send({ content: 'loading data...' });
      requestData()
        .then(async (NeuronData) => {
          await message.delete();
          if (NeuronData?.data?.neuron?.[Number(uid)]?.stake) {
            msg.channel.send(
              `UID:${uid} has τ${
                NeuronData?.data?.neuron?.[Number(uid)].stake / 1000000000
              } staked `
            );
          } else {
            msg.channel.send({ content: `No data` });
          }
        })
        .catch(async (err) => {
          await message.delete();
          msg.channel.send({ content: `Not found data` });
        });
    }
  },
};
