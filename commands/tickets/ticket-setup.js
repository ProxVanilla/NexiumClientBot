const { SlashCommandBuilder, PermissionFlagsBits, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');
const { infoEmbed } = require('../../utils/embeds');
const { requireStaff } = require('../../utils/permissions');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('ticket-setup')
    .setDescription('Post the ticket-creation panel in this channel.')
    .setDefaultMemberPermissions(PermissionFlagsBits.ManageGuild),

  async execute(interaction) {
    if (!(await requireStaff(interaction))) return;

    const embed = infoEmbed('🎫 Support Tickets', 'Click the button below to open a private support ticket with our team.');
    const row = new ActionRowBuilder().addComponents(
      new ButtonBuilder().setCustomId('ticket-open').setLabel('Open Ticket').setStyle(ButtonStyle.Primary).setEmoji('🎫')
    );

    await interaction.channel.send({ embeds: [embed], components: [row] });
    await interaction.reply({ content: 'Ticket panel posted.', ephemeral: true });
  }
};
