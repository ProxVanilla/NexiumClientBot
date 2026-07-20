const config = require('../config');
const { errorEmbed } = require('../utils/embeds');

module.exports = {
  customId: 'verify-member',

  async execute(interaction) {
    const role = interaction.guild.roles.cache.find((r) => r.name === config.verifiedRoleName);

    if (!role) {
      return interaction.reply({
        embeds: [errorEmbed(`No role named "${config.verifiedRoleName}" exists. Ask a staff member to fix the verification setup.`)],
        ephemeral: true
      });
    }

    if (interaction.member.roles.cache.has(role.id)) {
      return interaction.reply({ content: `You're already verified. Welcome to **${config.serverName}**! 🟣`, ephemeral: true });
    }

    try {
      await interaction.member.roles.add(role);
    } catch {
      return interaction.reply({ content: 'I couldn\'t assign that role — check that my role is above it in the role list.', ephemeral: true });
    }

    await interaction.reply({ content: `✅ You're verified! Welcome to **${config.serverName}**.`, ephemeral: true });
  }
};
