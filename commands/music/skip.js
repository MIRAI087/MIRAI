const { SlashCommandBuilder } = require("discord.js");

module.exports = {
    data: new SlashCommandBuilder()
        .setName("skip")
        .setDescription("Lewati lagu yang sedang diputar"),

    async execute(interaction) {

        const queue = interaction.client.player.nodes.get(interaction.guild.id);

        if (!queue || !queue.isPlaying()) {
            return interaction.reply({
                content: "❌ Tidak ada lagu yang sedang diputar.",
                ephemeral: true
            });
        }

        queue.node.skip();

        await interaction.reply("⏭️ Lagu berhasil dilewati.");
    }
};
