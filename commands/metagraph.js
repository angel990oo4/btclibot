const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

const { requestData } = require('../utils/data');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('matagraph')
    .setDescription('Metagraph raw value'),

  async execute(interaction) {
    await interaction.deferReply({ ephemeral: true });
    requestData()
      .then(async (res) => {
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
        const metagraphEmbed = new EmbedBuilder().setDescription(
          `Metagraph raw value`
        );
        await interaction.editReply({
          embeds: [metagraphEmbed],
          files: [file],
        });
      })
      .catch(async (err) => {
        await message.delete();
        console.log('ERROR', err);
        const errorEmbed = new EmbedBuilder()
          .setColor(0xee0000)
          .setDescription(`⚠️ No data found`);
        await interaction.editReply({
          embeds: [errorEmbed],
        });
      });
  },
};
