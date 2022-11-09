const { requestChain } = require('../utils/data');

module.exports = {
  async chainParameterExecute(msg, params) {
    const message = await msg.channel.send({
      content: 'loading data...',
    });
    requestChain()
      .then(async (res) => {
        await message.delete();
        console.log('res', params, res.data);
        let data = '';
        switch (params) {
          case 'block':
            data = `The current block number is ${res?.data?.block}`;
            break;
          case 'difficulty':
            data = `The difficulty value is ${res?.data?.difficulty}`;
            break;
          case 'issuance':
            data = `The total issuance value is ${res?.data?.totalIssuance}`;
            break;
          case 'next_halving':
            data = `${((10500000 - Number(res?.data?.block)) / 7200)
              .toFixed(1)
              .toString()} days are left until next halving`;
            break;
          default:
            break;
        }
        msg.channel.send({
          content: data,
        });
      })
      .catch((err) => {
        msg.channel.send({
          content: `${err}`,
        });
      });
  },
};
