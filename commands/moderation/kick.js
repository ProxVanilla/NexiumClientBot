const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');
const { successEmbed, errorEmbed } = require('../../utils/embeds');
const { requireStaff } = require('../../utils/permissions');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('kick')
    .setDescription('Kick a member from the server.')
    .setDefaultMemberPermissions(PermissionFlagsBits.KickMembers)
    .addUserOption((opt) => opt.setName('user').setDescription('The member to kick').setRequired(true))
    .addStringOption((opt) => opt.setName('reason').setDescription('Reason for the kick')),

  async execute(interaction) {
    if (!(await requireStaff(interaction))) return;

    const user = interaction.options.getUser('user');
    const reason = interaction.options.getString('reason') || 'No reason provided';
    const member = await interaction.guild.members.fetch(user.id).catch(() => null);

    if (!member) return interaction.reply({ embeds: [errorEmbed('That user is not in this server.')], ephemeral: true });
    if (!member.kickable) return interaction.reply({ embeds: [errorEmbed('I cannot kick this member.')], ephemeral: true });

    await member.kick(reason);
    await interaction.reply({ embeds: [successEmbed(`**${user.tag}** was kicked.\n**Reason:** ${reason}`)] });
  }
};
