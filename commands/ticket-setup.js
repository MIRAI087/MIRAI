const {
  SlashCommandBuilder,
  PermissionFlagsBits,
  EmbedBuilder,
} = require("discord.js");

const fs = require("node:fs");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("ticket-setup")
    .setDescription("Setup sistem ticket")
    .setDefaultMemberPermissions(PermissionFlagsBits.Administrator)

    .addChannelOption(option =>
      option
        .setName("kategori")
        .setDescription("Kategori ticket")
        .setRequired(true)
    )

    .addRoleOption(option =>
      option
        .setName("support")
        .setDescription("Role Support")
        .setRequired(true)
    )

    .addChannelOption(option =>
      option
        .setName("log")
        .setDescription("Channel log ticket")
        .setRequired(true)
    )

    .addStringOption(option =>
      option
        .setName("prefix")
        .setDescription("Prefix nama ticket")
        .setRequired(false)
    ),

  async execute(interaction) {

    const kategori = interaction.options.getChannel("kategori");
    const support = interaction.options.getRole("support");
    const log = interaction.options.getChannel("log");
    const prefix = interaction.options.getString("prefix") || "ticket";

    if (!fs.existsSync("./data")) {
      fs.mkdirSync("./data");
    }

    let config = {};

    if (fs.existsSync("./data/ticket.json")) {
      config = JSON.parse(fs.readFileSync("./data/ticket.json"));
    }

    config.category = kategori.id;
    config.support = support.id;
    config.log = log.id;
    config.prefix = prefix;

    fs.writeFileSync(
      "./data/ticket.json",
      JSON.stringify(config, null, 2)
    );

    const embed = new EmbedBuilder()
      .setColor("Green")
      .setTitle("✅ Ticket Setup Berhasil")
      .addFields(
        {
          name: "📂 Kategori",
          value: `${kategori}`,
          inline: true,
        },
        {
          name: "👮 Support",
          value: `${support}`,
          inline: true,
        },
        {
          name: "📜 Log",
          value: `${log}`,
          inline: true,
        },
        {
          name: "🏷 Prefix",
          value: prefix,
          inline: true,
        }
      )
      .setTimestamp();

    await interaction.reply({
      embeds: [embed],
    });
  },
};
