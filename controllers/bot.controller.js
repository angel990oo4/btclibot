const db = require('../models');
const Neuron = db.neuron;
const Block = db.block;

exports.getBot = async () => {
  return Neuron.findOne({}, { block: 1 })
    .sort({ block: -1 })
    .exec(function (err, block) {
      if (err) {
        return { message: err };
      }
      return Neuron.find(
        { block: block.block },
        {
          uid: 1,
          hotkey: 1,
          coldkey: 1,
          consensus: 1,
          active: 1,
          stake: 1,
          rank: 1,
          trust: 1,
          incentive: 1,
          dividends: 1,
          emission: 1,
          ip_type: 1,
          ip: 1,
        },
        (err, neuron) => {
          if (err) {
            return { message: err };
          }
          return {
            neuron: { data: neuron },
          };
        }
      );
    });
};
