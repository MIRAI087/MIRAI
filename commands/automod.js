const {
  SlashCommandBuilder,
  PermissionFlagsBits,
} = require("discord.js");

const fs = require("fs");

const FILE = "./data/automod.json";

function loadConfig() {
  if (!fs.existsSync(FILE)) {
    fs.writeFileSync(FILE, JSON.stringify({
      spam: {
        enabled: false,
        limit: 5,
        interval: 2,
        punishment: "timeout",
        duration: "10m"
      },
      antilink: {
        enabled: false,
        punishment: "timeout",
        duration: "10m"
      }
    }, null, 2));
  }

  return JSON.parse(fs.readFileSync(FILE));
}

module.exports = {
  data: new SlashCommandBuilder()
    .setName("automod")
    .setDescription("Pengaturan AutoMod")

    .addSubcommand(sub =>
      sub
        .setName("spam")
        .setDescription("Atur Anti Spam")
        .addBooleanOption(o =>
          o.setName("status")
            .setDescription("ON / OFF")
            .setRequired(true))
        .addIntegerOption(o =>
          o.setName("limit")
            .setDescription("Jumlah pesan")
            .setRequired(true))
        .addIntegerOption(o =>
          o.setName("interval")
            .setDescription("Detik")
            .setRequired(true))
        .addStringOption(o =>
          o.setName("punishment")
            .setDescription("Hukuman")
            .addChoices(
              { name: "Timeout", value: "timeout" },
              { name: "Warn", value: "warn" },
              { name: "Kick", value: "kick" },
              { name: "Ban", value: "ban" }
            )
            .setRequired(true))
        .addStringOption(o =>
          o.setName("duration")
            .setDescription("Contoh: 10m / 1h / 1d")
            .setRequired(true))
    )

    .addSubcommand(sub =>
      sub
        .setName("antilink")
        .setDescription("Atur Anti Link")
        .addBooleanOption(o =>
          o.setName("status")
            .setDescription("ON / OFF")
            .setRequired(true))
        .addStringOption(o =>
          o.setName("punishment")
            .setDescription("Hukuman")
            .addChoices(
              { name: "Timeout", value: "timeout" },
              { name: "Warn", value: "warn" },
              { name: "Kick", value: "kick" },
              { name: "Ban", value: "ban" }
            )
            .setRequired(true))
        .addStringOption(o =>
          o.setName("duration")
            .setDescription("Contoh: 10m")
            .setRequired(true))
    )

    .addSubcommand(sub =>
      sub
        .setName("status")
        .setDescription("Lihat konfigurasi AutoMod")
    )

    .setDefaultMemberPermissions(
      PermissionFlagsBits.Administrator
    ),

  async execute(interaction) {

    const config = loadConfig();

    const sub = interaction.options.getSubcommand();

    if (sub === "spam") {

      config.spam = {
        enabled: interaction.options.getBoolean("status"),
        limit: interaction.options.getInteger("limit"),
        interval: interaction.options.getInteger("interval"),
        punishment: interaction.options.getString("punishment"),
        duration: interaction.options.getString("duration"),
      };

    }

    if (sub === "antilink") {

      config.antilink = {
        enabled: interaction.options.getBoolean("status"),
        punishment: interaction.options.getString("punishment"),
        duration: interaction.options.getString("duration"),
      };

    }

    if (sub !== "status") {
      fs.writeFileSync(FILE, JSON.stringify(config, null, 2));
      return interaction.reply({
        content: "✅ Pengaturan AutoMod berhasil disimpan."
      });
    }

    return interaction.reply({
      content:
`## AutoMod

**Spam**
Status: ${config.spam.enabled ? "ON" : "OFF"}
Limit: ${config.spam.limit}
Interval: ${config.spam.interval}s
Punishment: ${config.spam.punishment}
Duration: ${config.spam.duration}

**Anti Link**
Status: ${config.antilink.enabled ? "ON" : "OFF"}
Punishment: ${config.antilink.punishment}
Duration: ${config.antilink.duration}`
    });

  },
};
