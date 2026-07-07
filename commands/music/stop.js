const { SlashCommandBuilder } = require("discord.js");

module.exports = {
    data: new SlashCommandBuilder()
        .setName("stop")
        .setDescription("Hentikan musik dan kosongkan antrean"),

    async execute(interaction) {

        const queue = interaction.client.player.nodes.get(interaction.guild.id);

        if (!queue || !queue.isPlaying()) {
            return interaction.reply({
                content: "❌ Tidak ada musik yang sedang diputar.",
                ephemeral: true
            });
        }

        queue.delete();

        await interaction.reply("⏹️ Musik dihentikan dan antrean dikosongkan.");
    }
};
