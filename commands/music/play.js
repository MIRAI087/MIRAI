const {
    SlashCommandBuilder,
    EmbedBuilder
} = require("discord.js");

module.exports = {
    data: new SlashCommandBuilder()
        .setName("play")
        .setDescription("Putar lagu dari YouTube, Spotify, atau SoundCloud")
        .addStringOption(option =>
            option
                .setName("query")
                .setDescription("Judul lagu atau URL")
                .setRequired(true)
        ),

    async execute(interaction) {
        const channel = interaction.member.voice.channel;

        if (!channel) {
            return interaction.reply({
                content: "❌ Kamu harus masuk ke voice channel terlebih dahulu.",
                ephemeral: true
            });
        }

        await interaction.deferReply();

        const query = interaction.options.getString("query");

        try {
            let player = interaction.client.lavalink.getPlayer(interaction.guild.id);

            if (!player) {
                player = interaction.client.lavalink.createPlayer({
                    guildId: interaction.guild.id,
                    voiceChannelId: channel.id,
                    textChannelId: interaction.channel.id,
                    selfDeaf: true,
                    selfMute: false
                });

                await player.connect();
            }

            const result = await player.search({
    query,
    source: "youtube"
}, interaction.user);

            if (!result || !result.tracks.length) {
    return interaction.editReply("❌ Lagu tidak ditemukan.");
}

player.queue.add(result.tracks);

if (!player.playing && !player.paused) {
    await player.play();
}

const track = result.tracks[0];

            player.queue.add(track);

            if (!player.playing && !player.paused) {
                await player.play();
            }

            const duration = track.info.isStream
                ? "Live"
                : `${Math.floor(track.info.length / 60000)}:${String(
                    Math.floor((track.info.length % 60000) / 1000)
                ).padStart(2, "0")}`;

            const embed = new EmbedBuilder()
                .setColor("#5865F2")
                .setTitle("🎵 Sekarang Diputar")
                .setDescription(`**${track.info.title}**`)
                                .addFields(
                    {
                        name: "👤 Author",
                        value: track.info.author || "Unknown",
                        inline: true
                    },
                    {
                        name: "⏱ Durasi",
                        value: duration,
                        inline: true
                    }
                );

            if (track.info.artworkUrl) {
                embed.setThumbnail(track.info.artworkUrl);
            }

            embed.setFooter({
                text: `Diminta oleh ${interaction.user.username}`,
                iconURL: interaction.user.displayAvatarURL()
            });

            await interaction.editReply({
                embeds: [embed]
            });

        } catch (err) {
            console.error(err);

            await interaction.editReply({
                content: "❌ Terjadi kesalahan saat memutar lagu."
            });
        }
    }
};
