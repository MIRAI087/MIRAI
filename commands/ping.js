const { SlashCommandBuilder } = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("ping")
    .setDescription("Cek apakah bot aktif"),

  async execute(interaction) {
    console.log("Ping diterima");
    console.log("Created:", interaction.createdTimestamp);
    console.log("Selisih:", Date.now() - interaction.createdTimestamp);

    await interaction.reply({
      content: "🏓 Pong!"
    });

    console.log("Reply berhasil");
  },
};
