const fs = require("fs");

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
      (time) =>
        now - time <= config.spam.interval * 1000
    );

  messages.push(now);

  users.set(key, messages);

  if (messages.length < config.spam.limit) return;

  users.delete(key);

  switch (config.spam.punishment) {
    case "timeout": {
      const ms = require("ms");

      try {
        await message.member.timeout(
          ms(config.spam.duration),
          "AutoMod Anti Spam"
        );

        await message.channel.send(
          `🚫 ${message.author} terkena timeout (${config.spam.duration}) karena spam.`
        );
      } catch {}
      break;
    }

    case "kick":
      try {
        await message.member.kick("Spam");
      } catch {}
      break;

    case "ban":
      try {
        await message.member.ban({
          reason: "Spam",
        });
      } catch {}
      break;

    case "warn":
      await message.channel.send(
        `⚠️ ${message.author} jangan spam!`
      );
      break;
  }
};
