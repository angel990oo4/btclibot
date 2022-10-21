const {
  SlashCommandBuilder,
  ActionRowBuilder,
  SelectMenuBuilder,
  ModalBuilder,
  TextInputBuilder,
  TextInputStyle,
} = require('discord.js');

const axios = require('axios');

const wait = require('node:timers/promises').setTimeout;

module.exports = {
  data: new SlashCommandBuilder()
    .setName('btcli')
    .setDescription('Bittensor Discord Cli')
    .addStringOption((option) =>
      option
        .setName('command')
        .setDescription('command')
        .setRequired(true)
        .addChoices({ name: 'stake', value: 'stake' })
    )
    .addStringOption((option) =>
      option
        .setName('uid')
        .setDescription('UID for Stake value')
        .setRequired(true)
    ),

  async execute(interaction) {
    const mechanism = interaction.options.getString('command');
    const uid = interaction.options.getString('uid');
    console.log('mechanism', mechanism);
    console.log('uid', uid);
    await interaction.deferReply({ ephemeral: false });

    if (mechanism === 'stake') {
      if (
        !Number.isInteger(Number(uid)) ||
        Number(uid) < 0 ||
        Number(uid) > 4095
      ) {
        await interaction.editReply(
          `UID should be an integer between 0 and 4095`
        );
      } else {
        await axios
          .get('https://arcane-mesa-86933.herokuapp.com/api/neuron')
          .then(async (res) => {
            await interaction.editReply(
              `UID:${uid} has τ${
                res.data.neuron[Number(uid)].stake / 1000000000
              } staked `,
              {
                ephemeral: false,
              }
            );
          })
          .catch(async (err) => {
            await interaction.editReply(`${err}`);
          });
      }
    } else {
      await interaction.editReply(`Unsupported mechanism`);
    }
  },
};
