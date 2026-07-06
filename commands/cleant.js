const {
  SlashCommandBuilder,
  EmbedBuilder,
  ChannelType,
} = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("cleant")
    .setDescription("Hapus chat user di semua channel")
    .addUserOption(option =>
      option
        .setName("user")
        .setDescription("User target")
        .setRequired(true)
    )
    .addIntegerOption(option =>
      option
        .setName("jumlah")
        .setDescription("Jumlah chat yang dihapus per channel")
        .setRequired(true)
        .setMinValue(1)
        .setMaxValue(100)
    ),

  async execute(interaction) {
    const target = interaction.options.getUser("user");
    const jumlah = interaction.options.getInteger("jumlah");

    await interaction.deferReply({ ephemeral: true });

    let total = 0;
    const hasil = [];

    for (const channel of interaction.guild.channels.cache.values()) {
      if (channel.type !== ChannelType.GuildText) continue;

      try {
        let before;
        let targetMessages = [];

        while (targetMessages.length < jumlah) {
          const fetched = await channel.messages.fetch({
            limit: 100,
            before,
          });

          if (!fetched.size) break;

          before = fetched.last().id;

          for (const msg of fetched.values()) {
            if (
              msg.author.id === target.id &&
              Date.now() - msg.createdTimestamp <
                14 * 24 * 60 * 60 * 1000
            ) {
              targetMessages.push(msg);

              if (targetMessages.length >= jumlah) break;
            }
          }
        }

        if (targetMessages.length) {
          await channel.bulkDelete(targetMessages, true);

          hasil.push(
            `#${channel.name} ➜ ${targetMessages.length} pesan`
          );

          total += targetMessages.length;
        }
      } catch {}
    }

    const embed = new EmbedBuilder()
      .setColor(0x0099ff)
      .setTitle("🧹 Pembersihan Selesai")
      .setDescription(
        `**Target:** ${target}\n**Jumlah per channel:** ${jumlah}\n\n${
          hasil.length ? hasil.join("\n") : "Tidak ada pesan yang ditemukan."
        }\n\n**Total dihapus:** ${total} pesan`
      )
      .setTimestamp();

    await interaction.editReply({ embeds: [embed] });
  },
};
