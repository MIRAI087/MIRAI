const {
  SlashCommandBuilder,
  PermissionFlagsBits,
  EmbedBuilder,
} = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("clear")
    .setDescription("Menghapus beberapa pesan")
    .addIntegerOption(option =>
      option
        .setName("jumlah")
        .setDescription("Jumlah pesan yang akan dihapus (1-100)")
        .setRequired(true)
        .setMinValue(1)
        .setMaxValue(100)
    )
    .setDefaultMemberPermissions(PermissionFlagsBits.ManageMessages),

  async execute(interaction) {
    const jumlah = interaction.options.getInteger("jumlah");

    await interaction.channel.bulkDelete(jumlah, true);

    const embed = new EmbedBuilder()
      .setColor(0x00BFFF)
      .setTitle("🗑️ Pesan Dihapus")
      .setDescription(`Berhasil menghapus **${jumlah}** pesan.`)
      .setFooter({
        text: `Oleh ${interaction.user.tag}`,
        iconURL: interaction.user.displayAvatarURL(),
      })
      .setTimestamp();

    await interaction.reply({
      embeds: [embed],
      ephemeral: true,
    });
  },
};
