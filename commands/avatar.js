const {
  SlashCommandBuilder,
  EmbedBuilder,
} = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("avatar")
    .setDescription("Menampilkan avatar pengguna")
    .addUserOption(option =>
      option
        .setName("user")
        .setDescription("Pilih pengguna")
        .setRequired(false)
    ),

  async execute(interaction) {
    const user =
      interaction.options.getUser("user") || interaction.user;

    const embed = new EmbedBuilder()
      .setColor(0x00BFFF)
      .setTitle(`🖼 Avatar ${user.username}`)
      .setImage(user.displayAvatarURL({ size: 4096 }))
      .setFooter({
        text: `Diminta oleh ${interaction.user.username}`,
        iconURL: interaction.user.displayAvatarURL(),
      })
      .setTimestamp();

    await interaction.reply({ embeds: [embed] });
  },
};
