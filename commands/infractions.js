const {
    SlashCommandBuilder,
    EmbedBuilder,
    PermissionFlagsBits
} = require("discord.js");

const infractions = require("../utils/infractions");

module.exports = {
    data: new SlashCommandBuilder()
        .setName("infractions")
        .setDescription("Lihat riwayat pelanggaran user.")
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

        const data = infractions.get(user.id);

        if (!data) {
            return interaction.reply({
                content: "✅ User ini belum memiliki pelanggaran.",
                ephemeral: true
            });
        }

        const history = data.history
            .map((item, index) =>
                `**${index + 1}.** ${item.type}\n<t:${Math.floor(new Date(item.date).getTime() / 1000)}:F>`
            )
            .join("\n\n");

        const embed = new EmbedBuilder()
            .setColor("#0099ff")
            .setTitle("🛡️ MIRAI • Infractions")
            .addFields(
                {
                    name: "👤 User",
                    value: `${user}`,
                    inline: true
                },
                {
                    name: "📈 Level",
                    value: `${data.level}`,
                    inline: true
                },
                {
                    name: "📋 History",
                    value: history || "Tidak ada"
                }
            )
            .setTimestamp();

        await interaction.reply({
            embeds: [embed]
        });

    }

};
