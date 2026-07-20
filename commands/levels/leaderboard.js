const { SlashCommandBuilder } = require('discord.js');
const { getLeaderboard } = require('../../services/levelService');
const { infoEmbed } = require('../../utils/embeds');

module.exports = {
  data: new SlashCommandBuilder().setName('leaderboard').setDescription('Show the server\'s top-ranked members.'),

  async execute(interaction) {
    const top = getLeaderboard(interaction.guild.id, 10);

    if (!top.length) {
      return interaction.reply({ embeds: [infoEmbed('🏆 Leaderboard', 'No one has earned XP yet — start chatting!')] });
    }

    const lines = top.map((row, i) => `**${i + 1}.** <@${row.user_id}> — Level ${row.level} (${row.xp} XP)`);
    await interaction.reply({ embeds: [infoEmbed('🏆 Leaderboard', lines.join('\n'))] });
  }
};
