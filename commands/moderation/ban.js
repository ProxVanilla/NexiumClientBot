const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');
const { successEmbed, errorEmbed } = require('../../utils/embeds');
const { requireStaff } = require('../../utils/permissions');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('ban')
    .setDescription('Ban a member from the server.')
    .setDefaultMemberPermissions(PermissionFlagsBits.BanMembers)
    .addUserOption((opt) => opt.setName('user').setDescription('The member to ban').setRequired(true))
    .addStringOption((opt) => opt.setName('reason').setDescription('Reason for the ban')),

  async execute(interaction) {
    if (!(await requireStaff(interaction))) return;

    const user = interaction.options.getUser('user');
    const reason = interaction.options.getString('reason') || 'No reason provided';
    const member = await interaction.guild.members.fetch(user.id).catch(() => null);

    if (member && !member.bannable) {
      return interaction.reply({ embeds: [errorEmbed('I cannot ban this member (role hierarchy or permissions).')], ephemeral: true });
    }

    await interaction.guild.members.ban(user.id, { reason });
    await interaction.reply({ embeds: [successEmbed(`**${user.tag}** was banned.\n**Reason:** ${reason}`)] });
  }
};
