const {
  SlashCommandBuilder,
  PermissionFlagsBits,
  EmbedBuilder,
} = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("kick")
    .setDescription("Mengeluarkan member dari server")
    .addUserOption(option =>
      option
        .setName("user")
        .setDescription("Member yang akan dikeluarkan")
        .setRequired(true)
    )
    .addStringOption(option =>
      option
        .setName("alasan")
        .setDescription("Alasan kick")
        .setRequired(false)
    )
    .setDefaultMemberPermissions(PermissionFlagsBits.KickMembers),

  async execute(interaction) {
    const user = interaction.options.getUser("user");
    const reason =
      interaction.options.getString("alasan") || "Tidak ada alasan";

    const member = await interaction.guild.members.fetch(user.id).catch(() => null);

    if (!member) {
      return interaction.reply({
        content: "❌ Member tidak ditemukan.",
        ephemeral: true,
      });
    }

    if (!member.kickable) {
      return interaction.reply({
        content: "❌ Saya tidak dapat mengeluarkan member tersebut.",
        ephemeral: true,
      });
    }

    await member.kick(reason);

    const embed = new EmbedBuilder()
      .setColor(0xff9900)
      .setTitle("👢 Member Dikeluarkan")
      .addFields(
        { name: "👤 Member", value: `${user.tag}`, inline: true },
        { name: "🛡 Moderator", value: `${interaction.user.tag}`, inline: true },
        { name: "📝 Alasan", value: reason }
      )
      .setThumbnail(user.displayAvatarURL())
      .setTimestamp();

    await interaction.reply({ embeds: [embed] });
  },
};
