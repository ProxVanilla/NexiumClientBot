const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');
const db = require('../../database/database');
const { errorEmbed, successEmbed } = require('../../utils/embeds');
const { requireStaff } = require('../../utils/permissions');

function pickWinners(entries, count) {
  const pool = [...entries];
  const winners = [];
  while (pool.length && winners.length < count) {
    const index = Math.floor(Math.random() * pool.length);
    winners.push(pool.splice(index, 1)[0]);
  }
  return winners;
}

module.exports = {
  data: new SlashCommandBuilder()
    .setName('gend')
    .setDescription('End a giveaway early by its message ID.')
    .setDefaultMemberPermissions(PermissionFlagsBits.ManageGuild)
    .addStringOption((opt) => opt.setName('message_id').setDescription('The giveaway message ID').setRequired(true)),

  async execute(interaction) {
    if (!(await requireStaff(interaction))) return;

    const messageId = interaction.options.getString('message_id');
    const giveaway = db.prepare('SELECT * FROM giveaways WHERE message_id = ? AND ended = 0').get(messageId);

    if (!giveaway) return interaction.reply({ embeds: [errorEmbed('No active giveaway found with that message ID.')], ephemeral: true });

    const entries = db.prepare('SELECT user_id FROM giveaway_entries WHERE giveaway_id = ?').all(giveaway.id).map((e) => e.user_id);
    const winners = pickWinners(entries, giveaway.winner_count);

    db.prepare('UPDATE giveaways SET ended = 1 WHERE id = ?').run(giveaway.id);

    const resultText = winners.length
      ? winners.map((id) => `<@${id}>`).join(', ')
      : 'No valid entries — no winner could be determined.';

    await interaction.reply({ embeds: [successEmbed(`Giveaway ended! **Prize:** ${giveaway.prize}\n**Winner(s):** ${resultText}`)] });
  }
};
