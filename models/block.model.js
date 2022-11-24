const mongoose = require("mongoose");

const Block = mongoose.model(
  "block",
  new mongoose.Schema({
    block:Number
  },
  {
    collection: 'block'
  }
  )
);

module.exports = Block;