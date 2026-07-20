require('dotenv').config();

function splitList(value) {
  return (value || '')
    .split(',')
    .map((v) => v.trim())
    .filter(Boolean);
}

module.exports = {
  botName: process.env.BOT_NAME || 'NexiumClient',
  serverName: process.env.SERVER_NAME || 'NexiumClient',

  token: process.env.DISCORD_TOKEN,
  clientId: process.env.CLIENT_ID,
  guildId: process.env.GUILD_ID,
  deployGuildOnly: process.env.DEPLOY_GUILD_ONLY === 'true',
  prefix: process.env.BOT_PREFIX || '!',

  // 🟣 Purple theme
  embedColor: process.env.EMBED_COLOR || '#9B59B6',

  // Staff roles by NAME (checked against the member's role names, not just Discord permissions).
  // This lets you grant bot-staff access to roles like "mod", "Drmelonn", "Nexium" directly,
  // in addition to whatever native Discord permissions those roles carry.
  staffRoleNames: splitList(process.env.STAFF_ROLE_NAMES).length
    ? splitList(process.env.STAFF_ROLE_NAMES)
    : ['mod', 'Drmelonn', 'Nexium'],

  // Role granted on verification
  verifiedRoleName: process.env.VERIFIED_ROLE_NAME || 'Member',

  tickets: {
    categoryId: process.env.TICKET_CATEGORY_ID || null,
    logChannelId: process.env.TICKET_LOG_CHANNEL_ID || null,
    supportRoleId: process.env.TICKET_SUPPORT_ROLE_ID || null
  },

  levels: {
    levelUpChannelId: process.env.LEVEL_UP_CHANNEL_ID || null
  },

  prices: {
    apiBase: process.env.PRICE_API_BASE || 'https://api.coingecko.com/api/v3'
  },

  database: {
    path: process.env.DATABASE_PATH || './database/nexium.sqlite'
  }
};
