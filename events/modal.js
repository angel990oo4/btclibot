const { ActionRowBuilder, SelectMenuBuilder } = require("discord.js");
let options = require("../store/option");

module.exports = {
  async execute(interaction) {
    if (interaction.customId === "optionModal") {
      const customerMessage =
        interaction.fields.getTextInputValue("customerMessage");
      const topK = interaction.fields.getTextInputValue("topK");
      const length = interaction.fields.getTextInputValue("length");
      const numBeams = interaction.fields.getTextInputValue("numBeams");
      const noRepeatNgramSize =
        interaction.fields.getTextInputValue("noRepeatNgramSize");
      options.prompt = customerMessage;
      options.topk = topK;
      options.num_to_generate = length;
      options.num_beams = numBeams;
      options.no_repeat_ngram_size = noRepeatNgramSize;

      const network = new ActionRowBuilder().addComponents(
        new SelectMenuBuilder()
          .setCustomId("network")
          .setPlaceholder("Specify network")
          .setMinValues(1)
          .setMaxValues(17)
          .addOptions([
            {
              description: "Select me",
              label: "gpt-j-6b(32-bit) UID: 72",
              value: "72",
            },
            {
              description: "Select me",
              label: "GPT-NEOX-20B UID: 80",
              value: "80",
            },
            {
              description: "Select me",
              label: "gpt-j-6b(16-bit) UID: 79",
              value: "79",
            },
            {
              description: "Select me",
              label: "OPT-1.3b UID: 43",
              value: "43",
            },
            {
              description: "Select me",
              label: "OPT-350m UID: 87",
              value: "87",
            },
            {
              description: "Select me",
              label: "OPT-125m UID: 88",
              value: "88",
            },
            {
              description: "Select me",
              label: "gpt2 UID: 44",
              value: "44",
            },
            {
              description: "Select me",
              label: "gpt2-large UID: 51",
              value: "51",
            },
            {
              description: "Select me",
              label: "EleutherAI/gpt-neo-125M UID: 55",
              value: "55",
            },
            {
              description: "Select me",
              label: "skt/kogpt2-base-v2 (korean) UID: 48",
              value: "48",
            },
            {
              description: "Select me",
              label: "aubmindlab/aragpt2-medium (arabic) UID: 52",
              value: "52",
            },
            {
              description: "Select me",
              label: "datificate/gpt2-small-spanish (spanish) UID: 47",
              value: "47",
            },
            {
              description: "Select me",
              label: "pierreguillou/gpt2-small-portuguese UID: 57",
              value: "57",
            },
            {
              description: "Select me",
              label: "gpt2 UID: 81",
              value: "81",
            },
            {
              description: "Select me",
              label: "bert-large-cased UID: 83",
              value: "83",
            },
            {
              description: "Select me",
              label: "gpt2-large UID: 82",
              value: "82",
            },
            {
              description: "Select me",
              label: "antoiloui/belgpt2 UID: 54",
              value: "54",
            },
          ])
      );
      await interaction.reply({
        content: "Please select network to query",
        ephemeral: true,
        components: [network],
      });
    }
  },
};
