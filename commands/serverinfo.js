const {
  SlashCommandBuilder,
  EmbedBuilder,
} = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("serverinfo")
    .setDescription("Menampilkan informasi server"),

  async execute(interaction) {
    const guild = interaction.guild;

    await guild.fetch();

    const owner = await guild.fetchOwner();

    const embed = new EmbedBuilder()
      .setColor(0x00BFFF)
      .setTitle(`🏠 ${guild.name}`)
      .setThumbnail(guild.iconURL({ dynamic: true }))
      .addFields(
        {
          name: "🆔 Server ID",
          value: guild.id,
          inline: true,
        },
        {
          name: "👑 Owner",
          value: `<@${owner.id}>`,
          inline: true,
        },
        {
          name: "👥 Member",
          value: `${guild.memberCount}`,
          inline: true,
        },
        {
          name: "💬 Channel",
          value: `${guild.channels.cache.size}`,
          inline: true,
        },
        {
          name: "🎭 Role",
          value: `${guild.roles.cache.size}`,
          inline: true,
        },
        {
          name: "😀 Emoji",
          value: `${guild.emojis.cache.size}`,
          inline: true,
        },
        {
          name: "📅 Dibuat",
          value: `<t:${Math.floor(guild.createdTimestamp / 1000)}:F>`,
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
