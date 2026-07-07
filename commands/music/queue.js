const {
    SlashCommandBuilder,
    EmbedBuilder
} = require("discord.js");

module.exports = {
    data: new SlashCommandBuilder()
        .setName("queue")
        .setDescription("Lihat antrean lagu"),

    async execute(interaction) {

        const queue = interaction.client.player.nodes.get(interaction.guild.id);

        if (!queue || !queue.isPlaying()) {
            return interaction.reply({
                content: "❌ Tidak ada lagu di antrean.",
                ephemeral: true
            });
        }

        const tracks = queue.tracks.toArray();

        const description = tracks.length
            ? tracks
                .slice(0, 10)
                .map((track, i) => `${i + 1}. **${track.title}**`)
                .join("\n")
            : "Tidak ada antrean.";

        const embed = new EmbedBuilder()
            .setColor("#5865F2")
            .setTitle("📜 Music Queue")
            .setDescription(description);

        await interaction.reply({
            embeds: [embed]
        });
    }
};
