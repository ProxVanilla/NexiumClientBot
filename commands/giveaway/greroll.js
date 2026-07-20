const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');
const db = require('../../database/database');
const { errorEmbed, successEmbed } = require('../../utils/embeds');
const { requireStaff } = require('../../utils/permissions');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('greroll')
    .setDescription('Reroll the winner(s) for an ended giveaway.')
    .setDefaultMemberPermissions(PermissionFlagsBits.ManageGuild)
    .addStringOption((opt) => opt.setName('message_id').setDescription('The giveaway message ID').setRequired(true)),

  async execute(interaction) {
    if (!(await requireStaff(interaction))) return;

    const messageId = interaction.options.getString('message_id');
    const giveaway = db.prepare('SELECT * FROM giveaways WHERE message_id = ? AND ended = 1').get(messageId);

    if (!giveaway) return interaction.reply({ embeds: [errorEmbed('No ended giveaway found with that message ID.')], ephemeral: true });

    const entries = db.prepare('SELECT user_id FROM giveaway_entries WHERE giveaway_id = ?').all(giveaway.id).map((e) => e.user_id);
    if (!entries.length) return interaction.reply({ embeds: [errorEmbed('There were no entries to reroll from.')], ephemeral: true });

    const winner = entries[Math.floor(Math.random() * entries.length)];
    await interaction.reply({ embeds: [successEmbed(`🎉 New winner for **${giveaway.prize}**: <@${winner}>`)] });
  }
};
