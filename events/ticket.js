const {
  ChannelType,
  PermissionsBitField,
  EmbedBuilder,
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
} = require("discord.js");

const fs = require("node:fs");

module.exports = async (interaction) => {

  if (!interaction.isButton()) return;
  if (!fs.existsSync("./data/ticket.json")) return;

  const config = JSON.parse(
    fs.readFileSync("./data/ticket.json")
  );

  // =========================
  // CREATE TICKET
  // =========================

  if (interaction.customId === "ticket_create") {

    const old = interaction.guild.channels.cache.find(
      c => c.topic === interaction.user.id
    );

    if (old) {
      return interaction.reply({
        content: `❌ Kamu sudah memiliki ticket ${old}`,
        ephemeral: true,
      });
    }

    config.counter++;

    fs.writeFileSync(
      "./data/ticket.json",
      JSON.stringify(config, null, 2)
    );

    const number = String(config.counter).padStart(4, "0");

    const channel = await interaction.guild.channels.create({
      name: `${config.prefix}-${number}`,
      type: ChannelType.GuildText,
      parent: config.category,
      topic: interaction.user.id,

      permissionOverwrites: [
        {
          id: interaction.guild.roles.everyone.id,
          deny: [PermissionsBitField.Flags.ViewChannel],
        },
        {
          id: interaction.user.id,
          allow: [
            PermissionsBitField.Flags.ViewChannel,
            PermissionsBitField.Flags.SendMessages,
            PermissionsBitField.Flags.ReadMessageHistory,
          ],
        },
        {
          id: config.support,
          allow: [
            PermissionsBitField.Flags.ViewChannel,
            PermissionsBitField.Flags.SendMessages,
            PermissionsBitField.Flags.ReadMessageHistory,
            PermissionsBitField.Flags.AttachFiles,
            PermissionsBitField.Flags.EmbedLinks,
          ],
        },
      ],
    });

    const embed = new EmbedBuilder()
      .setColor(config.panel.color)
      .setTitle("🎫 Ticket Dibuat")
      .setDescription(
        `Halo ${interaction.user}

Silakan jelaskan kendala atau pertanyaanmu.

Tim Support akan segera membantu.`
      );

    const row = new ActionRowBuilder().addComponents(
      new ButtonBuilder()
        .setCustomId("ticket_claim")
        .setLabel("Claim")
        .setEmoji("🙋")
        .setStyle(ButtonStyle.Success),

      new ButtonBuilder()
        .setCustomId("ticket_close")
        .setLabel("Close")
        .setEmoji("🔒")
        .setStyle(ButtonStyle.Danger),

      new ButtonBuilder()
        .setCustomId("ticket_add")
        .setLabel("Add")
        .setEmoji("➕")
        .setStyle(ButtonStyle.Primary),

      new ButtonBuilder()
        .setCustomId("ticket_remove")
        .setLabel("Remove")
        .setEmoji("➖")
        .setStyle(ButtonStyle.Secondary)
    );

    await channel.send({
      content: `<@&${config.support}> ${interaction.user}`,
      embeds: [embed],
      components: [row],
    });

    return interaction.reply({
      content: `✅ Ticket berhasil dibuat: ${channel}`,
      ephemeral: true,
    });
  }

  // =========================
  // CLAIM TICKET
  // =========================

  if (interaction.customId === "ticket_claim") {

    if (!interaction.member.roles.cache.has(config.support)) {
      return interaction.reply({
        content: "❌ Hanya tim Support yang dapat claim ticket.",
        ephemeral: true,
      });
    }

    const claimed = new EmbedBuilder()
      .setColor("Green")
      .setTitle("🙋 Ticket Claimed")
      .setDescription(
        `Ticket ini telah diambil oleh ${interaction.user}.`
      );

    await interaction.reply({
      embeds: [claimed],
    });

    if (!interaction.channel.name.startsWith("claimed-")) {
      await interaction.channel.setName(
        `claimed-${interaction.channel.name}`
      ).catch(() => {});
    }

    return;
  }

  // =========================
  // CLOSE TICKET
  // =========================

  if (interaction.customId === "ticket_close") {

    await interaction.reply({
      content: "🔒 Ticket akan ditutup dalam **5 detik**...",
    });

    setTimeout(async () => {
      await interaction.channel.delete().catch(() => {});
    }, 5000);

    return;
  }

  // =========================
  // ADD MEMBER
  // =========================

  if (interaction.customId === "ticket_add") {

    return interaction.reply({
      content: "🚧 Fitur Add Member sedang dalam pengembangan.",
      ephemeral: true,
    });

  }

  // =========================
  // REMOVE MEMBER
  // =========================

  if (interaction.customId === "ticket_remove") {

    return interaction.reply({
      content: "🚧 Fitur Remove Member sedang dalam pengembangan.",
      ephemeral: true,
    });

  }

};
