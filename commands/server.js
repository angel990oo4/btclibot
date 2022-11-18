const { SlashCommandBuilder } = require("discord.js");
const {
  ActionRowBuilder,
  ModalBuilder,
  TextInputBuilder,
  TextInputStyle,
  InteractionType,
  SelectMenuBuilder,
} = require("discord.js");

const wait = require("node:timers/promises").setTimeout;
const axios = require("axios");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("server")
    .setDescription("Querying the network!"),

  async execute(interaction) {
    // Create the modal
    const modal = new ModalBuilder()
      .setCustomId("myModal")
      .setTitle("My Modal");

    // Add components to modal

    const networkQuery = new SelectMenuBuilder()
      .setCustomId("select")
      .setPlaceholder("Nothing selected")
      .addOptions([
        {
          label: "Select me",
          description: "This is a description",
          value: "first_option",
        },
        {
          label: "You can select me too",
          description: "This is also a description",
          value: "second_option",
        },
      ]);

    // Create the text input components
    const favoriteColorInput = new TextInputBuilder()
      .setCustomId("favoriteColorInput")
      // The label is the prompt the user sees for this input
      .setLabel("What's your favorite color?")
      // Short means only a single line of text
      .setStyle(TextInputStyle.Short);

    const hobbiesInput = new TextInputBuilder()
      .setCustomId("hobbiesInput")
      .setLabel("What's some of your favorite hobbies?")
      // Paragraph means multiple lines of text.
      .setStyle(TextInputStyle.Paragraph);

    // An action row only holds one text input,
    // so you need one action row per text input.
    const networkActionRow = new ActionRowBuilder().addComponents(networkQuery);
    const firstActionRow = new ActionRowBuilder().addComponents(
      favoriteColorInput
    );
    const secondActionRow = new ActionRowBuilder().addComponents(hobbiesInput);

    // Add inputs to the modal
    modal.addComponents(firstActionRow, secondActionRow);
    // Show the modal to the user
    await interaction.showModal(modal);
  },
};
