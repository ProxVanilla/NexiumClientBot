const { SlashCommandBuilder } = require('discord.js');
const { infoEmbed } = require('../../utils/embeds');
const config = require('../../config');

// =====================================================================
// ✏️ EDIT THIS — everything below is shown by the /rules command.
// =====================================================================
const RULES_TITLE = `📜 ${config.serverName} Rules`;

const RULES = [
  'Treat everyone with respect — no harassment, hate speech, discrimination, or personal attacks.',
  'No spamming, excessive caps, or flooding channels with messages/emojis.',
  'No self-promotion, advertising, or unsolicited DMs without staff permission.',
  'No NSFW, gore, or otherwise inappropriate/shocking content.',
  'No sharing personal information — yours or anyone else\'s — without consent.',
  'Keep discussions in the appropriate channels; check pins/topics before posting.',
  'No political, religious, or otherwise inflammatory debates outside designated channels.',
  'Usernames, nicknames, and profile pictures must be appropriate — no slurs, offensive imagery, or impersonation of staff/other members.',
  'No soundboards, ear-rape, or disruptive audio in voice channels.',
  'No recording or streaming others without their consent.',
  'Follow instructions from staff — decisions from Staff are final. Appeals go through DMs to staff, not public argument.',
  'Don\'t abuse bot commands, exploit bugs, or attempt to bypass mutes/bans (e.g. alt accounts).',
  'Payment/purchase disputes go through the ticket system — do not DM staff directly for refunds or billing issues.',
  'Do not share, resell, or leak access granted through paid tiers (Lifetime/Monthly) without authorization.'
];

const RULES_FOOTER = 'Breaking these rules may result in a warning, mute, kick, or ban depending on severity and history.';
// =====================================================================

module.exports = {
  data: new SlashCommandBuilder().setName('rules').setDescription('View the server rules.'),

  async execute(interaction) {
    const description = RULES.map((rule, i) => `**${i + 1}.** ${rule}`).join('\n\n') + `\n\n*${RULES_FOOTER}*`;
    await interaction.reply({ embeds: [infoEmbed(RULES_TITLE, description)] });
  }
};