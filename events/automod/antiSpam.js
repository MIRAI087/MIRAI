const fs = require("fs");
const ms = require("ms");
const infractions = require("../../utils/infractions");

const users = new Map();

module.exports = async (message) => {
    if (!message.guild) return;
    if (message.author.bot) return;

    const config = JSON.parse(
        fs.readFileSync("./data/automod.json", "utf8")
    );

    if (!config.spam.enabled) return;

    const key = `${message.guild.id}-${message.author.id}`;

    if (!users.has(key)) {
        users.set(key, []);
    }

    const now = Date.now();

    const messages = users
        .get(key)
        .filter(
            (msg) =>
                now - msg.created <= config.spam.interval * 1000
        );

    messages.push({
        created: now,
        message
    });

    users.set(key, messages);

    if (messages.length < config.spam.limit) return;

    users.delete(key);

    // Hapus semua pesan spam
    for (const data of messages) {
        if (data.message.deletable) {
            await data.message.delete().catch(() => {});
        }
    }

    // Tambah level pelanggaran
    const level = infractions.add(
	message.guild.id,
        message.author.id,
        "Spam"
    );

    try {

        switch (level) {

            case 1:
                await message.member.timeout(
                    ms("10m"),
                    "Spam Level 1"
                );
                break;

            case 2:
                await message.member.timeout(
                    ms("1h"),
                    "Spam Level 2"
                );
                break;

            case 3:
                await message.member.timeout(
                    ms("1d"),
                    "Spam Level 3"
                );
                break;

            case 4:
                await message.member.kick(
                    "Spam Level 4"
                );
                break;

            default:
                await message.member.ban({
                    reason: "Spam Level 5"
                });
                break;

        }

    } catch (err) {
        console.log(err);
    }
const logChannel = message.guild.channels.cache.get(
    config.logs.channel
);

if (logChannel) {

    const { EmbedBuilder } = require("discord.js");

    const embed = new EmbedBuilder()
        .setColor("Red")
        .setTitle("🚨 AutoMod • Spam Detected")
        .addFields(
            {
                name: "👤 User",
                value: `${message.author}`,
                inline: true
            },
            {
                name: "📄 Pelanggaran",
                value: "Spam",
                inline: true
            },
            {
                name: "📈 Level",
                value: `${level}`,
                inline: true
            },
            {
                name: "🗑️ Pesan Dihapus",
                value: `${messages.length}`,
                inline: true
            },
            {
                name: "📍 Channel",
                value: `${message.channel}`,
                inline: true
            }
        )
        .setTimestamp();

    await logChannel.send({
        embeds: [embed]
    });

}

};
