const {
  SlashCommandBuilder,
  EmbedBuilder,
  PermissionFlagsBits,
} = require("discord.js");

const fs = require("node:fs");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("ticket-config")
    .setDescription("Lihat konfigurasi ticket")
    .setDefaultMemberPermissions(PermissionFlagsBits.Administrator),

  async execute(interaction) {

    if (!fs.existsSync("./data/ticket.json")) {
      return interaction.reply({
        content: "❌ Ticket belum disetup.",
        ephemeral: true,
      });
    }

    const config = JSON.parse(fs.readFileSync("./data/ticket.json"));

    const embed = new EmbedBuilder()
      .setColor(config.panel.color)
      .setTitle("🎫 Ticket Configuration")
      .addFields(
        {
          name: "📂 Kategori",
          value: config.category ? `<#${config.category}>` : "Belum diatur",
        },
        {
          name: "👮 Support",
          value: config.support ? `<@&${config.support}>` : "Belum diatur",
        },
        {
          name: "📜 Log",
          value: config.log ? `<#${config.log}>` : "Belum diatur",
        },
        {
          name: "🏷 Prefix",
          value: config.prefix,
        },
        {
          name: "📝 Judul",
          value: config.panel.title,
        },
        {
          name: "📄 Deskripsi",
          value: config.panel.description,
        }
      );

    await interaction.reply({
      embeds: [embed],
      ephemeral: true,
    });
  },
};
