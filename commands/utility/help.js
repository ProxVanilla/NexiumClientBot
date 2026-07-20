const { SlashCommandBuilder } = require('discord.js');
const { infoEmbed } = require('../../utils/embeds');

module.exports = {
  data: new SlashCommandBuilder().setName('help').setDescription('Lists all available commands.'),

  async execute(interaction, client) {
    const categories = {};
    for (const command of client.commands.values()) {
      const cat = command.category || 'misc';
      categories[cat] = categories[cat] || [];
      categories[cat].push(`\`/${command.data.name}\` — ${command.data.description}`);
    }

    const embed = infoEmbed('📖 Commands', 'Here\'s everything I can do:');
    for (const [category, list] of Object.entries(categories)) {
      embed.addFields({ name: category[0].toUpperCase() + category.slice(1), value: list.join('\n') });
    }

    await interaction.reply({ embeds: [embed] });
  }
};
