const { PermissionFlagsBits, ChannelType, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');
const db = require('../database/database');
const config = require('../config');
const { infoEmbed, errorEmbed } = require('../utils/embeds');
const { TICKET_CATEGORIES } = require('../services/ticketService');

module.exports = {
  customId: 'ticket-select',

  async execute(interaction) {
    const value = interaction.values[0];
    const category = TICKET_CATEGORIES.find((c) => c.value === value);

    if (!category) {
      return interaction.reply({ embeds: [errorEmbed('Unknown ticket category.')], ephemeral: true });
    }

    const existing = db
      .prepare('SELECT * FROM tickets WHERE guild_id = ? AND owner_id = ? AND status = ?')
      .get(interaction.guild.id, interaction.user.id, 'open');

    if (existing) {
      return interaction.reply({ embeds: [errorEmbed(`You already have an open ticket: <#${existing.channel_id}>`)], ephemeral: true });
    }

    const overwrites = [
      { id: interaction.guild.id, deny: [PermissionFlagsBits.ViewChannel] },
      { id: interaction.user.id, allow: [PermissionFlagsBits.ViewChannel, PermissionFlagsBits.SendMessages, PermissionFlagsBits.ReadMessageHistory] },
      { id: interaction.client.user.id, allow: [PermissionFlagsBits.ViewChannel, PermissionFlagsBits.SendMessages] }
    ];

    if (config.tickets.supportRoleId) {
      overwrites.push({ id: config.tickets.supportRoleId, allow: [PermissionFlagsBits.ViewChannel, PermissionFlagsBits.SendMessages] });
    }

    const channel = await interaction.guild.channels.create({
      name: `${category.value}-${interaction.user.username}`,
      type: ChannelType.GuildText,
      parent: config.tickets.categoryId || undefined,
      permissionOverwrites: overwrites
    });

    db.prepare(
      'INSERT INTO tickets (guild_id, channel_id, owner_id, status, created_at) VALUES (?, ?, ?, ?, ?)'
    ).run(interaction.guild.id, channel.id, interaction.user.id, 'open', Date.now());

    const row = new ActionRowBuilder().addComponents(
      new ButtonBuilder().setCustomId('ticket-close-btn').setLabel('Close Ticket').setStyle(ButtonStyle.Danger).setEmoji('🔒')
    );

    await channel.send({
      embeds: [
        infoEmbed(
          `${category.emoji} ${category.label} Ticket`,
          `Welcome ${interaction.user}! Support will be with you shortly.\n\n**Category:** ${category.label}`
        )
      ],
      components: [row]
    });

    await interaction.reply({ content: `Ticket created: ${channel}`, ephemeral: true });
  }
};
