const {
  SlashCommandBuilder,
  PermissionFlagsBits,
  EmbedBuilder,
} = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("ban")
    .setDescription("Ban member dari server")
    .addUserOption(option =>
      option
        .setName("user")
        .setDescription("Member yang akan diban")
        .setRequired(true)
    )
    .addIntegerOption(option =>
      option
        .setName("hapus_pesan")
        .setDescription("Hapus riwayat pesan (0-7 hari)")
        .setMinValue(0)
        .setMaxValue(7)
        .setRequired(false)
    )
    .addStringOption(option =>
      option
        .setName("alasan")
        .setDescription("Alasan ban")
        .setRequired(false)
    )
    .setDefaultMemberPermissions(PermissionFlagsBits.BanMembers),

  async execute(interaction) {
    const user = interaction.options.getUser("user");
    const deleteDays = interaction.options.getInteger("hapus_pesan") ?? 0;
    const reason =
      interaction.options.getString("alasan") || "Tidak ada alasan";

    const member = await interaction.guild.members
      .fetch(user.id)
      .catch(() => null);

    if (!member) {
      return interaction.reply({
        content: "❌ Member tidak ditemukan.",
        ephemeral: true,
      });
    }

    if (!member.bannable) {
      return interaction.reply({
        content: "❌ Saya tidak bisa memban member tersebut.",
        ephemeral: true,
      });
    }

    try {
      await user.send(
        `⛔ Kamu telah diban dari **${interaction.guild.name}**.\nAlasan: **${reason}**`
      );
    } catch {}

    await member.ban({
      deleteMessageSeconds: deleteDays * 86400,
      reason,
    });

    const embed = new EmbedBuilder()
      .setColor(0xFF0000)
      .setTitle("🔨 Member Berhasil Diban")
      .setThumbnail(user.displayAvatarURL())
      .addFields(
        {
          name: "👤 Member",
          value: `${user.tag}`,
          inline: true,
        },
        {
          name: "🛡 Moderator",
          value: `${interaction.user.tag}`,
          inline: true,
        },
        {
          name: "📝 Alasan",
          value: reason,
        },
        {
          name: "🗑 Hapus Pesan",
          value: `${deleteDays} hari`,
          inline: true,
        }
      )
      .setTimestamp();

    await interaction.reply({ embeds: [embed] });
  },
};
