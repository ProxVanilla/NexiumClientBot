const { SlashCommandBuilder } = require('discord.js');
const { getRank, xpForLevel } = require('../../services/levelService');
const { infoEmbed } = require('../../utils/embeds');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('rank')
    .setDescription('Check your (or someone else\'s) level and XP.')
    .addUserOption((opt) => opt.setName('user').setDescription('Whose rank to check')),

  async execute(interaction) {
    const target = interaction.options.getUser('user') || interaction.user;
    const { rank, total, user } = getRank(interaction.guild.id, target.id);
    const needed = xpForLevel(user.level);

    const embed = infoEmbed(
      `📊 Rank — ${target.username}`,
      `**Level:** ${user.level}\n**XP:** ${user.xp} / ${needed}\n**Server Rank:** ${rank ? `#${rank} of ${total}` : 'Unranked'}`
    );
    await interaction.reply({ embeds: [embed] });
  }
};
