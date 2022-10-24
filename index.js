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

let BitCliData = 'No Data';
Promise.resolve(requestData())
  .then((res) => {
    BitCliData = res;
  })
  .catch((err) => {
    BitCliData = `Can't get data`;
  });

//integrate polkadot for bittensor substrate
// const { NETWORKS } = require('./config/network');
// const { getNeurons } = require('./polkadot/query');

// const { api } = require('./polkadot/api');
// const apiCtx = await api(NETWORKS[0].endpoints);
// const result = await getNeurons(apiCtx);
// Create a new client instance
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
    const uid = msg.content.slice(13);
    if (
      !Number.isInteger(Number(uid)) ||
      Number(uid) < 0 ||
      Number(uid) > 4095
    ) {
      msg.channel.send(`UID should be an integer between 0 and 4095`);
    } else {
      if (BitCliData?.data?.neuron?.[Number(uid)]?.stake) {
        msg.channel.send(
          `UID:${uid} has τ${
            BitCliData.data.neuron[Number(uid)].stake / 1000000000
          } staked `
        );
      } else {
        msg.channel.send(`${BitCliData}`);
      }
    }
  }
  if (msg.content.slice(0, 14) === '$btcli inspect') {
    const uid = msg.content.slice(15);
    if (
      !Number.isInteger(Number(uid)) ||
      Number(uid) < 0 ||
      Number(uid) > 4095
    ) {
      msg.channel.send(`UID should be an integer between 0 and 4095`);
    } else {
      if (BitCliData?.data?.neuron?.[Number(uid)]?.stake) {
        // msg.channel.send(`UID:${uid} has`);
        msg.channel.send(
          `{\nhotkey: ${
            BitCliData.data.neuron[Number(uid)].hotkey
          }\ncoldkey : ${BitCliData.data.neuron[Number(uid)].coldkey}\nstake: ${
            BitCliData.data.neuron[Number(uid)].stake / 1000000000
          }\nrank: ${
            BitCliData.data.neuron[Number(uid)].rank / 18446744073709551615
          }\ntrust: ${
            BitCliData.data.neuron[Number(uid)].trust / 18446744073709551615
          }\nconsensus: ${
            BitCliData.data.neuron[Number(uid)].consensus / 18446744073709551615
          }\nincentive: ${
            BitCliData.data.neuron[Number(uid)].incentive / 18446744073709551615
          }\ndividends: ${
            BitCliData.data.neuron[Number(uid)].dividends / 18446744073709551615
          }\nemission: ${
            BitCliData.data.neuron[Number(uid)].emission / 1000000000
          }\nactive: ${
            BitCliData.data.neuron[Number(uid)].active ? 'true' : 'false'
          }\n}`
        );
      } else {
        msg.channel.send(`${BitCliData}`);
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

setInterval(() => {
  Promise.resolve(requestData())
    .then((res) => {
      BitCliData = res;
    })
    .catch((err) => {
      BitCliData = `Can't get data`;
    });
}, 100000);
