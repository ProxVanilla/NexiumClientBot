const { ActivityType } = require('discord.js');
const config = require('../config');

module.exports = {
  name: 'ready',
  once: true,
  execute(client) {
    console.log(`[ready] ${config.botName} logged in as ${client.user.tag} (${client.user.id})`);
    client.user.setPresence({
      activities: [{ name: `over ${config.serverName}`, type: ActivityType.Watching }],
      status: 'online'
    });
  }
};
