const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');
const { successEmbed, errorEmbed } = require('../../utils/embeds');
const { requireStaff } = require('../../utils/permissions');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('mute')
    .setDescription('Timeout a member for a given duration.')
    .setDefaultMemberPermissions(PermissionFlagsBits.ModerateMembers)
    .addUserOption((opt) => opt.setName('user').setDescription('The member to mute').setRequired(true))
    .addIntegerOption((opt) =>
      opt.setName('minutes').setDescription('Duration in minutes (max 40320 / 28 days)').setRequired(true).setMinValue(1).setMaxValue(40320)
    )
    .addStringOption((opt) => opt.setName('reason').setDescription('Reason for the mute')),

  async execute(interaction) {
    if (!(await requireStaff(interaction))) return;

    const user = interaction.options.getUser('user');
    const minutes = interaction.options.getInteger('minutes');
    const reason = interaction.options.getString('reason') || 'No reason provided';
    const member = await interaction.guild.members.fetch(user.id).catch(() => null);

    if (!member) return interaction.reply({ embeds: [errorEmbed('That user is not in this server.')], ephemeral: true });
    if (!member.moderatable) return interaction.reply({ embeds: [errorEmbed('I cannot mute this member.')], ephemeral: true });

    await member.timeout(minutes * 60_000, reason);
    await interaction.reply({ embeds: [successEmbed(`**${user.tag}** was muted for **${minutes} minutes**.\n**Reason:** ${reason}`)] });
  }
};
