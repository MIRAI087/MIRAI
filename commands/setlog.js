const {
    SlashCommandBuilder,
    PermissionFlagsBits
} = require("discord.js");

const fs = require("fs");

module.exports = {
    data: new SlashCommandBuilder()
        .setName("setlog")
        .setDescription("Atur channel log AutoMod.")
        .addChannelOption(option =>
            option
                .setName("channel")
                .setDescription("Pilih channel log")
                .setRequired(true)
        )
        .setDefaultMemberPermissions(
            PermissionFlagsBits.Administrator
        ),

    async execute(interaction) {

        const channel =
            interaction.options.getChannel("channel");

        const config = JSON.parse(
            fs.readFileSync("./data/automod.json", "utf8")
        );

        if (!config.logs) {
            config.logs = {};
        }

        config.logs.enabled = true;
        config.logs.channel = channel.id;

        fs.writeFileSync(
            "./data/automod.json",
            JSON.stringify(config, null, 4)
        );

        await interaction.reply({
            content: `✅ Channel log berhasil diatur ke ${channel}`,
            ephemeral: true
        });

    }
};
