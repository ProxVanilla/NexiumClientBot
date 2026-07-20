const { SlashCommandBuilder, PermissionFlagsBits, ChannelType, RoleSelectMenuBuilder } = require('discord.js');
const db = require('../../database/database');
const { successEmbed, infoEmbed } = require('../../utils/embeds');
const { requireStaff } = require('../../utils/permissions');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('config')
    .setDescription('View or update this server\'s bot settings.')
    .setDefaultMemberPermissions(PermissionFlagsBits.ManageGuild)
    .addSubcommand((sub) =>
      sub
        .setName('view')
        .setDescription('Show the current configuration for this server.')
    )
    .addSubcommand((sub) =>
      sub
        .setName('set-mute-role')
        .setDescription('Set the role applied when a member is muted.')
        .addRoleOption((opt) => opt.setName('role').setDescription('The mute role').setRequired(true))
    ),

  async execute(interaction) {
    if (!(await requireStaff(interaction))) return;

    const guildId = interaction.guild.id;
    db.prepare('INSERT OR IGNORE INTO guild_settings (guild_id) VALUES (?)').run(guildId);

    const sub = interaction.options.getSubcommand();

    if (sub === 'view') {
      const row = db.prepare('SELECT * FROM guild_settings WHERE guild_id = ?').get(guildId);
      const embed = infoEmbed(
        '⚙️ Server Configuration',
        Object.entries(row)
          .filter(([key]) => key !== 'guild_id')
          .map(([key, value]) => `**${key}**: ${value ? `<#${value}>` : 'Not set'}`)
          .join('\n')
      );
      return interaction.reply({ embeds: [embed] });
    }

    if (sub === 'set-mute-role') {
      const role = interaction.options.getRole('role');
      db.prepare('UPDATE guild_settings SET mute_role_id = ? WHERE guild_id = ?').run(role.id, guildId);
      return interaction.reply({ embeds: [successEmbed(`Mute role set to ${role}.`)] });
    }
  }
};
