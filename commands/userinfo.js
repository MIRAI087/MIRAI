const {
  SlashCommandBuilder,
  EmbedBuilder,
} = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("userinfo")
    .setDescription("Menampilkan informasi pengguna")
    .addUserOption(option =>
      option
        .setName("user")
        .setDescription("Pilih pengguna")
        .setRequired(false)
    ),

  async execute(interaction) {
    const user =
      interaction.options.getUser("user") || interaction.user;

    const member =
      interaction.guild.members.cache.get(user.id);

    const embed = new EmbedBuilder()
      .setColor(0x00BFFF)
      .setTitle(`👤 Informasi ${user.username}`)
      .setThumbnail(user.displayAvatarURL())
      .addFields(
        {
          name: "🆔 ID",
          value: user.id,
          inline: false,
        },
        {
          name: "📅 Akun Dibuat",
          value: `<t:${Math.floor(user.createdTimestamp / 1000)}:F>`,
          inline: false,
        },
        {
          name: "📥 Bergabung Server",
          value: member
            ? `<t:${Math.floor(member.joinedTimestamp / 1000)}:F>`
            : "Tidak diketahui",
          inline: false,
        }
      )
      .setFooter({
        text: `Diminta oleh ${interaction.user.username}`,
        iconURL: interaction.user.displayAvatarURL(),
      })
      .setTimestamp();

    await interaction.reply({ embeds: [embed] });
  },
};
