const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

const { requestData } = require('../utils/data');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('stake')
    .setDescription('Querying the stake value for a specific uid')
    .addStringOption((option) =>
      option
        .setName('--uid')
        .setDescription('enter the uid number')
        .setRequired(true)
    ),

  async execute(interaction) {
    await interaction.deferReply({ ephemeral: true });
    const uid = interaction.options.getString('--uid') ?? '0';
    requestData()
      .then(async (NeuronData) => {
        if (NeuronData?.data?.neuron?.[Number(uid)]?.stake) {
          const stakeEmbed = new EmbedBuilder()
            .setColor('#4caf50')
            .setDescription(
              `UID:**${uid}** has **τ${
                NeuronData?.data?.neuron?.[Number(uid)].stake / 1000000000
              }** staked `
            );
          await interaction.editReply({ embeds: [stakeEmbed] });
        } else {
          const errorEmbed = new EmbedBuilder()
            .setColor(0xee0000)
            .setDescription(`⚠️ No data found`);
          await interaction.editReply({ embeds: [errorEmbed] });
        }
      })
      .catch(async (err) => {
        console.log('err', err);
        const errorEmbed = new EmbedBuilder()
          .setColor(0xee0000)
          .setDescription(`⚠️ No data found`);
        await interaction.editReply({ embeds: [errorEmbed] });
      });
  },
};
