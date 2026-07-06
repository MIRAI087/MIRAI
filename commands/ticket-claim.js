const {
  SlashCommandBuilder,
  PermissionFlagsBits,
  EmbedBuilder,
} = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("ticket-claim")
    .setDescription("Claim ticket")
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

    if (!interaction.channel.name.startsWith("claimed-")) {
      await interaction.channel.setName(
        `claimed-${interaction.channel.name}`
      );
    }

    const embed = new EmbedBuilder()
      .setColor("Green")
      .setTitle("🙋 Ticket Claimed")
      .setDescription(
        `Ticket ini telah diambil oleh ${interaction.user}.`
      )
      .setTimestamp();

    await interaction.reply({
      embeds: [embed],
    });

  },
};
