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

// setInterval(() => {
//   BitCliData = requestData();
// }, 100000);
