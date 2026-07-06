const {
    SlashCommandBuilder,
    PermissionFlagsBits
} = require("discord.js");

const infractions = require("../utils/infractions");

module.exports = {
    data: new SlashCommandBuilder()
        .setName("clearinfractions")
        .setDescription("Hapus seluruh riwayat pelanggaran user.")
        .addUserOption(option =>
            option
                .setName("user")
                .setDescription("Pilih user")
                .setRequired(true)
        )
        .setDefaultMemberPermissions(
            PermissionFlagsBits.ModerateMembers
        ),

    async execute(interaction) {

        const user = interaction.options.getUser("user");

        infractions.clear(user.id);

        await interaction.reply({
            content: `✅ Riwayat pelanggaran ${user} berhasil dihapus.`,
            ephemeral: true
        });

    }
};
