const { SlashCommandBuilder, PermissionFlagsBits, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');
const config = require('../../config');
const { infoEmbed, errorEmbed } = require('../../utils/embeds');
const { requireStaff } = require('../../utils/permissions');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('verify-setup')
    .setDescription(`Post the verification panel that grants the "${config.verifiedRoleName}" role.`)
    .setDefaultMemberPermissions(PermissionFlagsBits.ManageGuild),

  async execute(interaction) {
    if (!(await requireStaff(interaction))) return;

    const role = interaction.guild.roles.cache.find((r) => r.name === config.verifiedRoleName);
    if (!role) {
      return interaction.reply({
        embeds: [errorEmbed(`No role named "${config.verifiedRoleName}" exists in this server yet. Create it first, then rerun this command.`)],
        ephemeral: true
      });
    }

    const embed = infoEmbed(
      `🟣 Welcome to ${config.serverName}`,
      `Click **Verify** below to confirm you've read the rules and unlock the rest of the server.`
    );
    const row = new ActionRowBuilder().addComponents(
      new ButtonBuilder().setCustomId('verify-member').setLabel('Verify').setStyle(ButtonStyle.Success).setEmoji('✅')
    );

    await interaction.channel.send({ embeds: [embed], components: [row] });
    await interaction.reply({ content: 'Verification panel posted.', ephemeral: true });
  }
};
