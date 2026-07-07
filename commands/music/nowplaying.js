const {
    SlashCommandBuilder,
    EmbedBuilder
} = require("discord.js");

module.exports = {
    data: new SlashCommandBuilder()
        .setName("nowplaying")
        .setDescription("Lihat lagu yang sedang diputar"),

    async execute(interaction) {

        const queue = interaction.client.player.nodes.get(interaction.guild.id);

        if (!queue || !queue.currentTrack) {
            return interaction.reply({
                content: "❌ Tidak ada lagu yang sedang diputar.",
                ephemeral: true
            });
        }

        const track = queue.currentTrack;

        const embed = new EmbedBuilder()
            .setColor("#5865F2")
            .setTitle("🎵 Sekarang Diputar")
            .setDescription(`**${track.title}**`)
            .setThumbnail(track.thumbnail)
            .addFields(
                {
                    name: "👤 Author",
                    value: track.author,
                    inline: true
                },
                {
                    name: "⏱ Durasi",
                    value: track.duration,
                    inline: true
                }
            );

        await interaction.reply({
            embeds: [embed]
        });
    }
};
