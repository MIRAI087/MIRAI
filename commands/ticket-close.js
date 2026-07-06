const {
  SlashCommandBuilder,
  PermissionFlagsBits,
} = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("ticket-close")
    .setDescription("Menutup ticket")
    .setDefaultMemberPermissions(
      PermissionFlagsBits.ManageChannels
    ),

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

    await interaction.reply({
      content: "🔒 Ticket akan ditutup dalam 5 detik..."
    });

    setTimeout(async () => {
      await interaction.channel.delete().catch(() => {});
    }, 5000);

  },
};
