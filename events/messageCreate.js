const { addMessageXp } = require('../services/levelService');
const config = require('../config');
const { infoEmbed } = require('../utils/embeds');

module.exports = {
  name: 'messageCreate',
  async execute(message) {
    if (message.author.bot || !message.guild) return;

    const result = addMessageXp(message.guild.id, message.author.id);
    if (result?.leveledUp) {
      const channelId = config.levels.levelUpChannelId || message.channel.id;
      const channel = message.guild.channels.cache.get(channelId) || message.channel;
      channel
        .send({ embeds: [infoEmbed('⬆️ Level Up!', `${message.author} just reached **Level ${result.newLevel}**!`)] })
        .catch(() => {});
    }
  }
};
