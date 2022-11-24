const mongoose = require('mongoose');

const Neuron = mongoose.model(
  'neuron',
  new mongoose.Schema(
    {
      uid: Number,
      active: Number,
      ip: Number,
      ip_type: Number,
      port: Number,
      modality: Number,
      hotkey: String,
      coldkey: String,
      last_update: Number,
      priority: Number,
      stake: Number,
      rank: Number,
      trust: Number,
      consensus: Number,
      incentive: Number,
      dividends: Number,
      emission: Number,
      block: Number,
      bonds: Array,
      weights: Array,
    },
    {
      collection: 'neuron',
    }
  )
);

module.exports = Neuron;
