const {
  SlashCommandBuilder,
  EmbedBuilder,
} = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("ticket-info")
    .setDescription("Melihat informasi ticket"),

  async execute(interaction) {

    if (
      !interaction.channel.name.startsWith("ticket") &&
      !interaction.channel.name.startsWith("claimed")
    ) {
      return interaction.reply({
        content: "❌ Command ini hanya bisa digunakan di dalam ticket.",
        ephemeral: true,
      });
    }

    const owner =
      interaction.channel.topic || "Tidak diketahui";

    const embed = new EmbedBuilder()
      .setColor(0x0099ff)
      .setTitle("🎫 Informasi Ticket")
      .addFields(
        {
          name: "👤 Pembuat",
          value: `<@${owner}>`,
          inline: true,
        },
        {
          name: "📛 Nama",
          value: interaction.channel.name,
          inline: true,
        },
        {
          name: "🆔 Channel ID",
          value: interaction.channel.id,
          inline: false,
        },
        {
          name: "📅 Dibuat",
          value: `<t:${Math.floor(interaction.channel.createdTimestamp / 1000)}:F>`,
          inline: false,
        }
      )
      .setTimestamp();

    await interaction.reply({
      embeds: [embed],
    });

  },
};
