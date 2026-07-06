require("dotenv").config();

const {
  Client,
  GatewayIntentBits,
  Collection,
  Events,
} = require("discord.js");

const fs = require("node:fs");

const ticketEvent = require("./events/ticket");
const antiLink = require("./events/automod/antiLink");
const antiSpam = require("./events/automod/antiSpam");

const client = new Client({
  intents: [
  GatewayIntentBits.Guilds,
  GatewayIntentBits.GuildMessages,
  GatewayIntentBits.MessageContent,
],
});

client.commands = new Collection();

const commandFiles = fs
  .readdirSync("./commands")
  .filter(file => file.endsWith(".js"));

for (const file of commandFiles) {
  const command = require(`./commands/${file}`);
  client.commands.set(command.data.name, command);
}

client.once(Events.ClientReady, client => {
  console.log(`✅ Login sebagai ${client.user.tag}`);
});

client.on(Events.InteractionCreate, async interaction => {

  // Slash Command
  if (interaction.isChatInputCommand()) {
    const command = client.commands.get(interaction.commandName);

    if (!command) return;

    try {
      await command.execute(interaction);
    } catch (error) {
      console.error(error);

      if (interaction.replied || interaction.deferred) {
        await interaction.followUp({
          content: "❌ Terjadi error.",
          ephemeral: true,
        });
      } else {
        await interaction.reply({
          content: "❌ Terjadi error.",
          ephemeral: true,
        });
      }
    }

    return;
  }

  // Button Ticket
if (interaction.isButton()) {
    await ticketEvent(interaction);
}

});

client.on("messageCreate", async (message) => {
    await antiLink(message);
    await antiSpam(message);
});

client.login(process.env.TOKEN);
