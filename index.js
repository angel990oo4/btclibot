const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const { inspectExecute } = require('./btcli/inspect');
const { emissionExecute, emissionExecuteRaw } = require('./btcli/emission');
const { incentiveExecute, incentiveExecuteRaw } = require('./btcli/incentive');
const { matagraphExecuteRaw } = require('./btcli/metagraph');
const { stakeExecute } = require('./btcli/stake');
const { helpExecute } = require('./btcli/help');
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
  EmbedBuilder,
  MessageEmbed,
  MessageAttachment,
  AttachmentBuilder,
} = require('discord.js');
const { token } = require('./config');

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

client.on('messageCreate', async (msg) => {
  if (msg.author.bot) return;
  const discordMessage = msg.content.replace(/\s+/g, ' ');
  if (discordMessage.slice(0, 6) === '$btcli' && discordMessage.length <= 50) {
    if (discordMessage.slice(0, 18) === '$btcli stake --uid') {
      const uid = discordMessage.slice(18);
      stakeExecute(uid, msg);
    } else if (discordMessage.slice(0, 20) === '$btcli inspect --uid') {
      const uid = discordMessage.slice(20);
      inspectExecute(uid, msg);
    } else {
      switch (discordMessage) {
        case '$btcli': {
          helpExecute(msg);
          break;
        }
        case '$btcli --help': {
          helpExecute(msg);
          break;
        }
        case '$btcli metagraph --raw': {
          matagraphExecuteRaw(msg);
          break;
        }
        case '$btcli incentive': {
          incentiveExecute(msg);
          break;
        }
        case '$btcli incentive --raw': {
          incentiveExecuteRaw(msg, 'raw');
          break;
        }
        case '$btcli incentive --raw --ascending': {
          incentiveExecuteRaw(msg, 'ascending');
          break;
        }
        case '$btcli incentive --raw --descending': {
          incentiveExecuteRaw(msg, 'descending');
          break;
        }
        case '$btcli emission': {
          emissionExecute(msg);
          break;
        }
        case '$btcli emission --raw': {
          emissionExecuteRaw(msg);
          break;
        }
        default:
          msg.channel.send({
            content: `**$btcli: ${discordMessage.slice(
              6
            )}** is not a btcli command. See **$btcli --help**.`,
          });
          break;
      }
    }
  } else return;
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
