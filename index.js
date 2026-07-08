require("dotenv").config();

const {
    Client,
    GatewayIntentBits,
    Collection,
    Events
} = require("discord.js");

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

client.once(Events.ClientReady, () => {
    console.log(`✅ Login sebagai ${client.user.tag}`);
});

client.on(Events.InteractionCreate, async (interaction) => {
    if (interaction.isChatInputCommand()) {
        const command = client.commands.get(interaction.commandName);

        if (!command) return;

        try {
            await command.execute(interaction);
        } catch (err) {
            console.error(err);

            if (interaction.deferred || interaction.replied) {
                await interaction.followUp({
                    content: "❌ Terjadi error.",
                    ephemeral: true
                }).catch(() => {});
            } else {
                await interaction.reply({
                    content: "❌ Terjadi error.",
                    ephemeral: true
                }).catch(() => {});
            }
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
