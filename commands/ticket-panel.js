const {
  SlashCommandBuilder,
  PermissionFlagsBits,
  EmbedBuilder,
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
} = require("discord.js");

const fs = require("node:fs");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("ticket-panel")
    .setDescription("Kirim panel ticket")
    .setDefaultMemberPermissions(PermissionFlagsBits.Administrator)

    .addChannelOption(option =>
      option
        .setName("channel")
        .setDescription("Channel tempat panel dikirim")
        .setRequired(true)
    ),

  async execute(interaction) {

    if (!fs.existsSync("./data/ticket.json")) {
      return interaction.reply({
        content: "❌ Jalankan /ticket-setup terlebih dahulu.",
        ephemeral: true,
      });
    }

    const config = JSON.parse(
      fs.readFileSync("./data/ticket.json")
    );

    const channel = interaction.options.getChannel("channel");

    config.panel.channel = channel.id;

    fs.writeFileSync(
      "./data/ticket.json",
      JSON.stringify(config, null, 2)
    );

    const embed = new EmbedBuilder()
      .setColor(config.panel.color)
      .setTitle(config.panel.title)
      .setDescription(config.panel.description)
      .setFooter({
        text: config.panel.footer,
      });

    if (config.panel.thumbnail)
      embed.setThumbnail(config.panel.thumbnail);

    if (config.panel.image)
      embed.setImage(config.panel.image);

    const row = new ActionRowBuilder().addComponents(
      new ButtonBuilder()
        .setCustomId("ticket_create")
        .setLabel(config.panel.button)
        .setEmoji(config.panel.emoji)
        .setStyle(ButtonStyle.Primary)
    );

    await channel.send({
      embeds: [embed],
      components: [row],
    });

    await interaction.reply({
      content: `✅ Panel ticket berhasil dikirim ke ${channel}`,
      ephemeral: true,
    });
  },
};
