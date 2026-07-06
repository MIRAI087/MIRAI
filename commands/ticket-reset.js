const {
  SlashCommandBuilder,
  PermissionFlagsBits,
} = require("discord.js");

const fs = require("node:fs");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("ticket-reset")
    .setDescription("Reset semua konfigurasi ticket")
    .setDefaultMemberPermissions(PermissionFlagsBits.Administrator),

  async execute(interaction) {

    const data = {
      category: "",
      support: "",
      log: "",
      prefix: "ticket",
      counter: 0,
      panel: {
        channel: "",
        title: "🎫 Support Ticket",
        description: "Klik tombol di bawah untuk membuat ticket.",
        color: "#5865F2",
        button: "Buat Ticket",
        emoji: "🎫",
        thumbnail: "",
        image: "",
        footer: "MIRAI Ticket System"
      }
    };

    fs.writeFileSync(
      "./data/ticket.json",
      JSON.stringify(data, null, 2)
    );

    await interaction.reply({
      content: "✅ Konfigurasi ticket berhasil direset.",
      ephemeral: true,
    });
  },
};
