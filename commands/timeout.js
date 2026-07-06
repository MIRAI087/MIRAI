const {
  SlashCommandBuilder,
  PermissionFlagsBits,
  EmbedBuilder,
} = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("timeout")
    .setDescription("Memberikan timeout kepada member")
    .addUserOption(option =>
      option
        .setName("user")
        .setDescription("Member yang akan di-timeout")
        .setRequired(true)
    )
    .addIntegerOption(option =>
      option
        .setName("durasi")
        .setDescription("Durasi timeout")
        .setRequired(true)
        .setMinValue(1)
    )
    .addStringOption(option =>
      option
        .setName("satuan")
        .setDescription("Satuan waktu")
        .setRequired(true)
        .addChoices(
          { name: "Menit", value: "m" },
          { name: "Jam", value: "h" },
          { name: "Hari", value: "d" }
        )
    )
    .addStringOption(option =>
      option
        .setName("alasan")
        .setDescription("Alasan timeout")
        .setRequired(false)
    )
    .setDefaultMemberPermissions(PermissionFlagsBits.ModerateMembers),

  async execute(interaction) {
    const member = interaction.options.getMember("user");
    const durasi = interaction.options.getInteger("durasi");
    const satuan = interaction.options.getString("satuan");
    const alasan =
      interaction.options.getString("alasan") || "Tidak ada alasan";

    if (!member) {
      return interaction.reply({
        content: "❌ Member tidak ditemukan.",
        ephemeral: true,
      });
    }

    if (!member.moderatable) {
      return interaction.reply({
        content: "❌ Saya tidak dapat melakukan timeout pada member tersebut.",
        ephemeral: true,
      });
    }

    let ms = 0;

    switch (satuan) {
      case "m":
        ms = durasi * 60 * 1000;
        break;
      case "h":
        ms = durasi * 60 * 60 * 1000;
        break;
      case "d":
        ms = durasi * 24 * 60 * 60 * 1000;
        break;
    }

    try {
      await member.send(
        `⏰ Kamu telah di-timeout di **${interaction.guild.name}** selama **${durasi} ${
          satuan === "m"
            ? "menit"
            : satuan === "h"
            ? "jam"
            : "hari"
        }**.\nAlasan: **${alasan}**`
      );
    } catch {}

    await member.timeout(ms, alasan);

    const embed = new EmbedBuilder()
      .setColor(0xF39C12)
      .setTitle("⏰ Member Berhasil Di-timeout")
      .setThumbnail(member.user.displayAvatarURL())
      .addFields(
        {
          name: "👤 Member",
          value: member.user.tag,
          inline: true,
        },
        {
          name: "🛡 Moderator",
          value: interaction.user.tag,
          inline: true,
        },
        {
          name: "⏳ Durasi",
          value: `${durasi} ${
            satuan === "m"
              ? "Menit"
              : satuan === "h"
              ? "Jam"
              : "Hari"
          }`,
          inline: true,
        },
        {
          name: "📝 Alasan",
          value: alasan,
        }
      )
      .setTimestamp();

    await interaction.reply({ embeds: [embed] });
  },
};
