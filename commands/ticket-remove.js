const {
  SlashCommandBuilder,
  PermissionFlagsBits,
} = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("ticket-remove")
    .setDescription("Menghapus member dari ticket")
    .addUserOption(option =>
      option
        .setName("user")
        .setDescription("Member yang ingin dihapus")
        .setRequired(true)
    )
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

    const user = interaction.options.getUser("user");

    await interaction.channel.permissionOverwrites.delete(user.id);

    await interaction.reply({
      content: `✅ ${user} berhasil dihapus dari ticket.`,
    });

  },
};
