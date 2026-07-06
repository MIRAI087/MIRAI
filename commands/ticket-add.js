const {
  SlashCommandBuilder,
  PermissionFlagsBits,
} = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("ticket-add")
    .setDescription("Menambahkan member ke ticket")
    .addUserOption(option =>
      option
        .setName("user")
        .setDescription("Member yang ingin ditambahkan")
        .setRequired(true)
    )
    .setDefaultMemberPermissions(
      PermissionFlagsBits.ManageChannels
    ),

  async execute(interaction) {

    if (!interaction.channel.name.startsWith("ticket") &&
        !interaction.channel.name.startsWith("claimed")) {
      return interaction.reply({
        content: "❌ Command ini hanya bisa digunakan di ticket.",
        ephemeral: true,
      });
    }

    const user = interaction.options.getUser("user");

    await interaction.channel.permissionOverwrites.edit(user.id, {
      ViewChannel: true,
      SendMessages: true,
      ReadMessageHistory: true,
      AttachFiles: true,
      EmbedLinks: true,
    });

    await interaction.reply({
      content: `✅ ${user} berhasil ditambahkan ke ticket.`,
    });

  },
};
