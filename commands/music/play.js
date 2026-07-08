const {
    SlashCommandBuilder,
    EmbedBuilder
} = require("discord.js");

module.exports = {
    data: new SlashCommandBuilder()
        .setName("play")
        .setDescription("Putar lagu")
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

        let player = interaction.client.kazagumo.players.get(interaction.guild.id);

        if (!player) {
            player = await interaction.client.kazagumo.createPlayer({
                guildId: interaction.guild.id,
                textId: interaction.channel.id,
                voiceId: channel.id,
                volume: 100,
                deaf: true
            });

            await player.connect();
        } else if (player.voiceId !== channel.id) {
            player.setVoiceChannel(channel.id);
            await player.connect();
        }

        const result = await interaction.client.kazagumo.search(query, {
            requester: interaction.user
        });

        if (!result || !result.tracks.length) {
            return interaction.editReply({
                content: "❌ Lagu tidak ditemukan."
            });
        }

        if (result.type === "PLAYLIST") {
            player.queue.add(result.tracks);
        } else {
            player.queue.add(result.tracks[0]);
        }

        if (!player.playing && !player.paused) {
            await player.play();
        }

        const track = result.tracks[0];

        const duration = track.length
            ? `${Math.floor(track.length / 60000)}:${String(Math.floor((track.length % 60000) / 1000)).padStart(2, "0")}`
            : "Live";

        const embed = new EmbedBuilder()
            .setColor("#5865F2")
            .setTitle("🎵 Ditambahkan ke Queue")
            .setDescription(`**${track.title}**`)
            .addFields(
                {
                    name: "👤 Author",
                    value: track.author ?? "Unknown",
                    inline: true
                },
                {
                    name: "⏱ Durasi",
                    value: duration,
                    inline: true
                }
            )
            .setThumbnail(track.thumbnail ?? null)
            .setFooter({
                text: `Diminta oleh ${interaction.user.username}`,
                iconURL: interaction.user.displayAvatarURL()
            });

        return interaction.editReply({
            embeds: [embed]
        });
    }
};
