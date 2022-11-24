const mongoose = require('mongoose');

const db = {};

db.mongoose = mongoose;

db.block = require("./block.model");
db.neuron = require("./neuron.model");

module.exports = db;