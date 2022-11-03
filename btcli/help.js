const { BtcliCommands } = require('../const/btclicommands');

module.exports = {
  async helpExecute(msg) {
    msg.channel.send({
      content: `${BtcliCommands}`,
    });
  },
};
