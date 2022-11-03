const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const axios = require('axios');
const { requestData } = require('./utils/data');
const { ChartJSNodeCanvas } = require('chartjs-node-canvas');
const { Chart } = require('chart.js');
const { generateCanva } = require('./btcli/chartNeuron');
const { BtcliCommands } = require('./const/btclicommands');

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
// const { realNeuron } = require('./polkadot/neuron');
// let NeuronData = 'No Data';

// const { NETWORKS } = require('./config/network');

// const { api } = require('./polkadot/api');

// let apiCtx;
// const getNeurons = async () => {
//   // let myInterval;
//   try {
//     apiCtx = await api(NETWORKS[0].endpoints);
//     console.log('apiCtx', apiCtx);
//     // NeuronData = await realNeuron(apiCtx);
//     // myInterval = setInterval(async () => {
//     // NeuronData = await realNeuron(apiCtx);
//     // }, 120000);
//   } catch (err) {
//     // clearInterval(myInterval);
//     getNeurons();
//   }
// };
// getNeurons();

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
  if (discordMessage.slice(0, 6) === '$btcli') {
    if (discordMessage.slice(0, 12) === '$btcli stake') {
      const uid = discordMessage.slice(12);
      if (
        !Number.isInteger(Number(uid)) ||
        Number(uid) < 0 ||
        Number(uid) > 4095
      ) {
        msg.channel.send({
          content: `UID should be an integer between 0 and 4095`,
        });
      } else {
        const message = await msg.channel.send({ content: 'loading data...' });
        requestData()
          .then(async (NeuronData) => {
            await message.delete();

            if (NeuronData?.data?.neuron?.[Number(uid)]?.stake) {
              msg.channel.send(
                `UID:${uid} has τ${
                  NeuronData?.data?.neuron?.[Number(uid)].stake / 1000000000
                } staked `
              );
            } else {
              msg.channel.send({ content: `No data` });
            }
          })
          .catch(async (err) => {
            await message.delete();
            msg.channel.send({ content: `Not found data` });
          });
      }
    } else if (discordMessage.slice(0, 14) === '$btcli inspect') {
      const uid = discordMessage.slice(14);
      if (
        !Number.isInteger(Number(uid)) ||
        Number(uid) < 0 ||
        Number(uid) > 4095
      ) {
        msg.channel.send({
          content: `UID should be an integer between 0 and 4095`,
        });
      } else {
        const message = await msg.channel.send({ content: 'loading data...' });

        requestData()
          .then(async (res) => {
            await message.delete();

            let NeuronData = res?.data?.neuron;
            if (NeuronData?.[Number(uid)]?.stake) {
              // msg.channel.send(`UID:${uid} has`);
              msg.channel.send({
                content: `Uid: ${uid}\n{\n  hotkey: ${
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
                }\n  active: ${
                  NeuronData[Number(uid)].active ? 'true' : 'false'
                }\n}`,
              });
            } else {
              await message.delete();
              msg.channel.send({ content: `No data` });
            }
          })
          .catch(async (err) => {
            await message.delete();
            msg.channel.send({ content: `Not found data` });
          });
      }
    } else {
      switch (discordMessage) {
        case '$btcli emission': {
          const message = await msg.channel.send({
            content: 'loading data...',
          });
          requestData()
            .then(async (res) => {
              await message.delete();
              let NeuronData = res?.data?.neuron;
              let labels = Array.from(new Array(4096), (x, i) => i);
              let data = NeuronData.map(
                (neuron, index) => neuron.emission / 1000000000
              );
              const attachment = await generateCanva(
                labels,
                data.sort(function (a, b) {
                  return a - b;
                }),
                (title = 'Emission')
              );
              chartEmbed = {
                title: 'MessageEmbed title',
                image: {
                  url: 'attachment://graph.png',
                },
              };
              msg.channel.send({
                content: 'Emission value',
                files: [attachment],
              });
            })
            .catch((err) => {
              msg.channel.send({
                content: `${err}`,
              });
            });
          break;
        }
        case '$btcli incentive': {
          const message = await msg.channel.send({
            content: 'loading data...',
          });
          requestData()
            .then(async (res) => {
              await message.delete();
              let NeuronData = res?.data?.neuron;
              let labels = Array.from(new Array(4096), (x, i) => i);
              let data = NeuronData.map(
                (neuron, index) => neuron.incentive / 18446744073709551615
              );
              const attachment = await generateCanva(
                labels,
                data.sort(function (a, b) {
                  return a - b;
                }),
                (title = 'Incentive')
              );
              chartEmbed = {
                title: 'MessageEmbed title',
                image: {
                  url: 'attachment://graph.png',
                },
              };
              msg.channel.send({
                content: 'Incentive value',
                files: [attachment],
              });
            })
            .catch((err) => {
              msg.channel.send({
                content: `${err}`,
              });
            });
          break;
        }
        case '$btcli incentive --raw': {
          const message = await msg.channel.send({
            content: 'loading data...',
          });
          requestData()
            .then(async (res) => {
              await message.delete();
              let NeuronData = res?.data?.neuron;
              const csvContent = NeuronData.map((neuron, index) =>
                [
                  `${neuron.uid}`,
                  `${neuron.incentive / 18446744073709551615}`,
                ].join(',')
              ).join('\n');
              const buffer = Buffer.from(csvContent, 'utf-8');
              const file = new AttachmentBuilder(buffer, {
                name: 'uid_incentive.csv',
              });
              msg.channel.send({
                content: 'Incentive raw value',
                files: [file],
              });
            })
            .catch((err) => {
              msg.channel.send({
                content: `${err}`,
              });
            });
          break;
        }
        case '$btcli metagraph --raw': {
          const message = await msg.channel.send({
            content: 'loading data...',
          });
          requestData()
            .then(async (res) => {
              await message.delete();
              let NeuronData = res?.data?.neuron;
              let csvContent = NeuronData.map((neuron, index) =>
                [
                  `${neuron.uid}`,
                  `${neuron.hotkey}`,
                  `${neuron.coldkey}`,
                  `${neuron.stake / 1000000000}`,
                  `${neuron.rank / 18446744073709551615}`,
                  `${neuron.trust / 18446744073709551615}`,
                  `${neuron.consensus / 18446744073709551615}`,
                  `${neuron.incentive / 18446744073709551615}`,
                  `${neuron.dividends / 18446744073709551615}`,
                  `${neuron.emission / 1000000000}`,
                  `${neuron.active}`,
                ].join(', ')
              );
              csvContent.unshift(
                'UID, HotKey, ColdKey, Stake, Rank, Trust, Consensus, Incentive, Dividends, Emission, Active'
              );
              csvContent = csvContent.join('\n');

              const buffer = Buffer.from(csvContent, 'utf-8');
              const file = new AttachmentBuilder(buffer, {
                name: 'metagraph.csv',
              });
              msg.channel.send({
                content: 'Metagraph raw value',
                files: [file],
              });
            })
            .catch((err) => {
              msg.channel.send({
                content: `${err}`,
              });
            });
          break;
        }
        case '$btcli incentive --raw --ascending': {
          const message = await msg.channel.send({
            content: 'loading data...',
          });
          requestData()
            .then(async (res) => {
              await message.delete();
              let NeuronData = res?.data?.neuron;
              const csvContent = NeuronData.sort(function (a, b) {
                return a.incentive - b.incentive;
              })
                .map((neuron, index) =>
                  [
                    `${neuron.uid}`,
                    `${neuron.incentive / 18446744073709551615}`,
                  ].join(',')
                )
                .join('\n');
              const buffer = Buffer.from(csvContent, 'utf-8');
              const file = new AttachmentBuilder(buffer, {
                name: 'uid_incentive_ascending.csv',
              });
              msg.channel.send({
                content: 'Incentive raw value',
                files: [file],
              });
            })
            .catch((err) => {
              msg.channel.send({
                content: `${err}`,
              });
            });
          break;
        }
        case '$btcli incentive --raw --descending': {
          const message = await msg.channel.send({
            content: 'loading data...',
          });
          requestData()
            .then(async (res) => {
              await message.delete();
              let NeuronData = res?.data?.neuron;
              const csvContent = NeuronData.sort(function (a, b) {
                return b.incentive - a.incentive;
              })
                .map((neuron, index) =>
                  [
                    `${neuron.uid}`,
                    `${neuron.incentive / 18446744073709551615}`,
                  ].join(',')
                )
                .join('\n');
              const buffer = Buffer.from(csvContent, 'utf-8');
              const file = new AttachmentBuilder(buffer, {
                name: 'uid_incentive_descending.csv',
              });
              msg.channel.send({
                content: 'Incentive raw value',
                files: [file],
              });
            })
            .catch((err) => {
              msg.channel.send({
                content: `${err}`,
              });
            });
          break;
        }
        case '$btcli emission --raw': {
          const message = await msg.channel.send({
            content: 'loading data...',
          });
          requestData()
            .then(async (res) => {
              await message.delete();
              let NeuronData = res?.data?.neuron;
              const csvContent = NeuronData.map((neuron, index) =>
                [`${neuron.uid}`, `${neuron.emission / 1000000000}`].join(',')
              ).join('\n');
              const buffer = Buffer.from(csvContent, 'utf-8');
              const file = new AttachmentBuilder(buffer, {
                name: 'uid_emission.csv',
              });
              msg.channel.send({
                content: 'Emission raw value',
                files: [file],
              });
            })
            .catch((err) => {
              msg.channel.send({
                content: `${err}`,
              });
            });
          break;
        }
        case '$btcli': {
          msg.channel.send({
            content: `${BtcliCommands}`,
          });
          break;
        }
        case '$btcli --help': {
          msg.channel.send({
            content: `${BtcliCommands}`,
          });
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
