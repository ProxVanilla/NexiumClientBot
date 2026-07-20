const { SlashCommandBuilder } = require('discord.js');
const { infoEmbed } = require('../../utils/embeds');

module.exports = {
  data: new SlashCommandBuilder().setName('ping').setDescription('Check the bot\'s latency.'),

  async execute(interaction) {
    const sent = await interaction.reply({ content: 'Pinging...', fetchReply: true });
    const latency = sent.createdTimestamp - interaction.createdTimestamp;

    const embed = infoEmbed('🏓 Pong!', `Roundtrip: **${latency}ms**\nAPI Latency: **${Math.round(interaction.client.ws.ping)}ms**`);
    await interaction.editReply({ content: null, embeds: [embed] });
  }
};
