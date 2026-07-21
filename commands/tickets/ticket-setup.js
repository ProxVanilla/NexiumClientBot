const { SlashCommandBuilder, PermissionFlagsBits, ActionRowBuilder, StringSelectMenuBuilder } = require('discord.js');
const { infoEmbed } = require('../../utils/embeds');
const { requireStaff } = require('../../utils/permissions');
const config = require('../../config');
const { TICKET_CATEGORIES } = require('../../services/ticketService');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('ticket-setup')
    .setDescription('Post the ticket-creation panel in this channel.')
    .setDefaultMemberPermissions(PermissionFlagsBits.ManageGuild),

  async execute(interaction) {
    if (!(await requireStaff(interaction))) return;

    const embed = infoEmbed(
      `${config.serverName} Support`,
      'Select a category below to open a ticket. The menu resets after every use, so you can always reopen it.'
    );

    const menu = new StringSelectMenuBuilder()
      .setCustomId('ticket-select')
      .setPlaceholder('Select a ticket type')
      .addOptions(
        TICKET_CATEGORIES.map((cat) => ({
          label: cat.label,
          description: cat.description,
          value: cat.value,
          emoji: cat.emoji
        }))
      );

    const row = new ActionRowBuilder().addComponents(menu);

    await interaction.channel.send({ embeds: [embed], components: [row] });
    await interaction.reply({ content: 'Ticket panel posted.', ephemeral: true });
  }
};
