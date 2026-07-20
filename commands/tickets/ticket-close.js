const { SlashCommandBuilder } = require('discord.js');
const db = require('../../database/database');
const { errorEmbed, successEmbed } = require('../../utils/embeds');

module.exports = {
  data: new SlashCommandBuilder().setName('ticket-close').setDescription('Close the current ticket channel.'),

  async execute(interaction) {
    const ticket = db.prepare('SELECT * FROM tickets WHERE channel_id = ? AND status = ?').get(interaction.channel.id, 'open');

    if (!ticket) {
      return interaction.reply({ embeds: [errorEmbed('This channel is not an open ticket.')], ephemeral: true });
    }

    db.prepare('UPDATE tickets SET status = ?, closed_at = ? WHERE id = ?').run('closed', Date.now(), ticket.id);
    await interaction.reply({ embeds: [successEmbed('Closing this ticket in 5 seconds...')] });

    setTimeout(() => interaction.channel.delete().catch(() => {}), 5000);
  }
};
