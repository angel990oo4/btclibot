const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const axios = require('axios');
const { requestData } = require('./utils/data');

const app = express();
var corsOptions = {
  origin: '*',
};
app.use(cors(corsOptions));

// parse requests of content-type - application/json
app.use(bodyParser.json());

// parse requests of content-type - application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: true }));

const fs = require('node:fs');
const path = require('node:path');
const {
  Client,
  Collection,
  GatewayIntentBits,
  InteractionType,
} = require('discord.js');
const { token } = require('./config');

//neuron data from MongoDB
// let BitCliData = 'No Data';
// Promise.resolve(requestData())
//   .then((res) => {
//     BitCliData = res;
//   })
//   .catch((err) => {
//     BitCliData = `Can't get data`;
//   });

//integrate polkadot for bittensor substrate
const { realNeuron } = require('./polkadot/neuron');
let NeuronData = 'No Data';

const { NETWORKS } = require('./config/network');

const { api } = require('./polkadot/api');

const getNeurons = async () => {
  let = myInterval;
  try {
    const apiCtx = await api(NETWORKS[0].endpoints);
    NeuronData = await realNeuron(apiCtx);
    myInterval = setInterval(async () => {
      NeuronData = await realNeuron(apiCtx);
    }, 120000);
  } catch (err) {
    clearInterval(myInterval);
    getNeurons();
  }
};
getNeurons();

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
    GatewayIntentBits.GuildMessageReactions,
  ],
});

client.commands = new Collection();
const commandsPath = path.join(__dirname, 'commands');
const commandFiles = fs
  .readdirSync(commandsPath)
  .filter((file) => file.endsWith('.js'));

for (const file of commandFiles) {
  const filePath = path.join(commandsPath, file);
  const command = require(filePath);
  client.commands.set(command.data.name, command);
}

// When the client is ready, run this code (only once)
client.once('ready', () => {
  console.log('Ready!');
});

client.on('interactionCreate', async (interaction) => {
  if (!interaction.isChatInputCommand()) return;
  const command = client.commands.get(interaction.commandName);
  if (!command) return;
  try {
    await command.execute(interaction);
  } catch (error) {
    console.error(error);
    await interaction.reply({
      content: 'There was an error while executing this command!',
      ephemeral: true,
    });
  }
});

client.on('messageCreate', (msg) => {
  if (msg.author.bot) return;
  if (msg.content.slice(0, 12) === '$btcli stake') {
    const uid = msg.content.slice(12);
    if (
      !Number.isInteger(Number(uid)) ||
      Number(uid) < 0 ||
      Number(uid) > 4095
    ) {
      msg.channel.send(`UID should be an integer between 0 and 4095`);
    } else {
      if (NeuronData?.[Number(uid)]?.stake) {
        msg.channel.send(
          `UID:${uid} has τ${
            NeuronData[Number(uid)].stake / 1000000000
          } staked `
        );
      } else {
        msg.channel.send(`${NeuronData}`);
      }
    }
  }
  if (msg.content.slice(0, 14) === '$btcli inspect') {
    const uid = msg.content.slice(14);
    console.log('btcli inspect', uid);
    if (
      !Number.isInteger(Number(uid)) ||
      Number(uid) < 0 ||
      Number(uid) > 4095
    ) {
      msg.channel.send(`UID should be an integer between 0 and 4095`);
    } else {
      if (NeuronData?.[Number(uid)]?.stake) {
        // msg.channel.send(`UID:${uid} has`);
        msg.channel.send(
          `Uid: ${uid}\n  hotkey: ${
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
          }\n  active: ${NeuronData[Number(uid)].active ? 'true' : 'false'}\n}`
        );
      } else {
        msg.channel.send(`${NeuronData}`);
      }
    }
  }
});

client.login(token);

// simple route
app.get('/', (req, res) => {
  res.json({ message: 'Welcome to bittensor Tao Bot.' });
});

// set port, listen for requests
const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}.`);
});

//backend API from MongoDB
// setInterval(() => {
//   Promise.resolve(requestData())
//     .then((res) => {
//       BitCliData = res;
//     })
//     .catch((err) => {
//       BitCliData = `Can't get data`;
//     });
// }, 100000);

// setInterval(() => {
//   getNeurons();
// }, 500000);
