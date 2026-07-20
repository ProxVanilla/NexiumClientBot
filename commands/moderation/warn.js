const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');
const db = require('../../database/database');
const { successEmbed } = require('../../utils/embeds');
const { requireStaff } = require('../../utils/permissions');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('warn')
    .setDescription('Issue a warning to a member.')
    .setDefaultMemberPermissions(PermissionFlagsBits.ModerateMembers)
    .addUserOption((opt) => opt.setName('user').setDescription('The member to warn').setRequired(true))
    .addStringOption((opt) => opt.setName('reason').setDescription('Reason for the warning').setRequired(true)),

  async execute(interaction) {
    if (!(await requireStaff(interaction))) return;

    const user = interaction.options.getUser('user');
    const reason = interaction.options.getString('reason');

    db.prepare(
      'INSERT INTO warnings (guild_id, user_id, moderator_id, reason, created_at) VALUES (?, ?, ?, ?, ?)'
    ).run(interaction.guild.id, user.id, interaction.user.id, reason, Date.now());

    const count = db
      .prepare('SELECT COUNT(*) AS c FROM warnings WHERE guild_id = ? AND user_id = ?')
      .get(interaction.guild.id, user.id).c;

    await interaction.reply({ embeds: [successEmbed(`**${user.tag}** was warned (${count} total warning${count === 1 ? '' : 's'}).\n**Reason:** ${reason}`)] });
  }
};
