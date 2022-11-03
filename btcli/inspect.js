const { requestData } = require('../utils/data');
const { validUID } = require('../utils/utils');

module.exports = {
  async inspectExecute(uid, msg) {
    if (!validUID(uid)) {
      msg.channel.send({
        content: `*UID should be an integer between 0 and 4095*`,
      });
    } else {
      const message = await msg.channel.send({ content: 'loading data...' });
      requestData()
        .then(async (res) => {
          await message.delete();
          let NeuronData = res?.data?.neuron;
          if (NeuronData?.[Number(uid)]?.stake) {
            msg.channel.send({
              content: `Uid: ${uid}\n{\n  hotkey: ${
                NeuronData[Number(uid)].hotkey
              }\n  coldkey : ${NeuronData[Number(uid)].coldkey}\n  stake: ${
                NeuronData[Number(uid)].stake / 1000000000
              }\n  rank: ${
                NeuronData[Number(uid)].rank / 18446744073709551615
              }\n  trust: ${
                NeuronData[Number(uid)].trust / 18446744073709551615
              }\n  consensus: ${
                NeuronData[Number(uid)].consensus / 18446744073709551615
              }\n  incentive: ${
                NeuronData[Number(uid)].incentive / 18446744073709551615
              }\n  dividends: ${
                NeuronData[Number(uid)].dividends / 18446744073709551615
              }\n  emission: ${
                NeuronData[Number(uid)].emission / 1000000000
              }\n  active: ${
                NeuronData[Number(uid)].active ? 'true' : 'false'
              }\n}`,
            });
          } else {
            await message.delete();
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
