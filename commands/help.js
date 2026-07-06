const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("help")
    .setDescription("Menampilkan daftar command bot"),

  async execute(interaction) {
    const embed = new EmbedBuilder()
      .setColor(0x00BFFF)
      .setTitle("📖 MIRAI Help Menu")
      .setDescription("Daftar command yang tersedia.")
      .addFields(
        {
          name: "⚡ General",
          value:
            "`/ping`\n`/help`\n`/avatar`\n`/userinfo`\n`/serverinfo`",
        },
        {
          name: "🛠 Moderation",
          value:
            "`/clear`\n`/kick`\n`/ban`\n`/timeout`",
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
