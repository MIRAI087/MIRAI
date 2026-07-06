const {
  SlashCommandBuilder,
  PermissionFlagsBits,
} = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("ticket-rename")
    .setDescription("Mengubah nama ticket")
    .addStringOption(option =>
      option
        .setName("nama")
        .setDescription("Nama ticket baru")
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

    const nama = interaction.options
      .getString("nama")
      .toLowerCase()
      .replace(/\s+/g, "-");

    await interaction.channel.setName(nama);

    await interaction.reply({
      content: `✅ Nama ticket berhasil diubah menjadi \`${nama}\`.`,
    });

  },
};
