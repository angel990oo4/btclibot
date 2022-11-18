const {
  SlashCommandBuilder,
  ActionRowBuilder,
  SelectMenuBuilder,
  ModalBuilder,
  TextInputBuilder,
  TextInputStyle,
} = require('discord.js');
const wait = require('node:timers/promises').setTimeout;
let options = require('../store/option');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('generate')
    .setDescription('Querying the network!'),

  async execute(interaction) {
    options = {
      do_sample: true,
      early_stopping: false,
      network: 'nakamoto',
      no_repeat_ngram_size: '2',
      num_beams: '5',
      num_return_sequences: '1',
      num_to_generate: '64',
      prompt: 'Prompt message',
      top_p: '0.95',
      topk: '512',
      uid: [72],
    };
    const modal = new ModalBuilder()
      .setCustomId('optionModal')
      .setTitle('Bittensor Options');
    const customerMessage = new TextInputBuilder()
      .setCustomId('customerMessage')
      .setLabel('Customer Message')
      .setStyle(TextInputStyle.Paragraph)
      .setValue(options.prompt);

    const topK = new TextInputBuilder()
      .setCustomId('topK')
      .setLabel('TopK(Number)')
      .setStyle(TextInputStyle.Short)
      .setValue(options.topk);

    const length = new TextInputBuilder()
      .setCustomId('length')
      .setLabel('Length(Number)')
      .setStyle(TextInputStyle.Short)
      .setValue(options.num_to_generate);

    const numBeams = new TextInputBuilder()
      .setCustomId('numBeams')
      .setLabel('Num Beams(Number)')
      .setStyle(TextInputStyle.Short)
      .setValue(options.num_beams);

    const noRepeatNgramSize = new TextInputBuilder()
      .setCustomId('noRepeatNgramSize')
      .setLabel('No Repeat Ngram Size(Number)')
      .setStyle(TextInputStyle.Short)
      .setValue(options.no_repeat_ngram_size);

    const customerMessageRow = new ActionRowBuilder().addComponents(
      customerMessage
    );
    const topKRow = new ActionRowBuilder().addComponents(topK);
    const lengthRow = new ActionRowBuilder().addComponents(length);
    const numBeamsRow = new ActionRowBuilder().addComponents(numBeams);
    const noRepeatNgramSizeRow = new ActionRowBuilder().addComponents(
      noRepeatNgramSize
    );

    modal.addComponents(
      customerMessageRow,
      topKRow,
      lengthRow,
      numBeamsRow,
      noRepeatNgramSizeRow
      // doSampleRow
    );
    await interaction.showModal(modal);
  },
};
