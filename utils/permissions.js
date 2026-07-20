const config = require('../config');

/**
 * True if the member has one of the configured staff role NAMES
 * (config.staffRoleNames: "mod", "Drmelonn", "Nexium" by default).
 */
function hasStaffRole(member) {
  if (!member?.roles?.cache) return false;
  return member.roles.cache.some((role) => config.staffRoleNames.includes(role.name));
}

/**
 * Guard for command execute() functions: allows the interaction through if the
 * member either has the native Discord permission the slash command already
 * requires, OR holds one of the configured staff roles by name. Returns true
 * if allowed; replies with an error and returns false if not.
 */
async function requireStaff(interaction) {
  const member = interaction.member;
  if (hasStaffRole(member)) return true;

  const { errorEmbed } = require('./embeds');
  await interaction.reply({
    embeds: [errorEmbed(`You need a staff role (${config.staffRoleNames.join(', ')}) to use this command.`)],
    ephemeral: true
  });
  return false;
}

module.exports = { hasStaffRole, requireStaff };
