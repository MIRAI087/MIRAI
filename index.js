require("dotenv").config();

const {
    Client,
    GatewayIntentBits,
    Collection,
    Events
} = require("discord.js");

const { LavalinkManager } = require("lavalink-client");

const fs = require("node:fs");
const path = require("node:path");

const ticketEvent = require("./events/ticket");
const antiLink = require("./events/automod/antiLink");
const antiSpam = require("./events/automod/antiSpam");

const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent,
        GatewayIntentBits.GuildVoiceStates
    ]
});

client.commands = new Collection();

client.lavalink = new LavalinkManager({
    nodes: [
        {
            id: "main",
            host: process.env.LAVALINK_HOST,
            port: Number(process.env.LAVALINK_PORT),
            authorization: process.env.LAVALINK_PASSWORD,
            secure: process.env.LAVALINK_SECURE === "true"
        }
    ],

    sendToShard: (guildId, payload) => {
        const guild = client.guilds.cache.get(guildId);
        if (guild) guild.shard.send(payload);
    }
});

function loadCommands(dir) {
    const files = fs.readdirSync(dir);

    for (const file of files) {
        const fullPath = path.join(dir, file);

        if (fs.statSync(fullPath).isDirectory()) {
            loadCommands(fullPath);
            continue;
        }

        if (!file.endsWith(".js")) continue;

        const command = require(path.resolve(fullPath));

        if (command.data && command.execute) {
            client.commands.set(command.data.name, command);
        }
    }
}

loadCommands(path.join(__dirname, "commands"));

client.once(Events.ClientReady, async () => {
    console.log(`✅ Login sebagai ${client.user.tag}`);

    await client.lavalink.init({
        id: client.user.id,
        username: client.user.username
    });

    console.log("🎵 Lavalink Connected!");
});

client.on("raw", (packet) => {
    client.lavalink.sendRawData(packet);
});

client.on(Events.InteractionCreate, async (interaction) => {
    if (interaction.isChatInputCommand()) {
        const command = client.commands.get(interaction.commandName);

        if (!command) return;

        try {
            await command.execute(interaction);
        } catch (err) {
            console.error(err);
        }

        return;
    }

    if (interaction.isButton()) {
        await ticketEvent(interaction);
    }
});

client.on("messageCreate", async (message) => {
    await antiLink(message);
    await antiSpam(message);
});

client.login(process.env.TOKEN);
