const { SlashCommandBuilder } = require('discord.js');
const { PRICING } = require('../../services/priceService');
const { infoEmbed } = require('../../utils/embeds');

module.exports = {
  data: new SlashCommandBuilder().setName('prices').setDescription('View pricing and payment options.'),

  async execute(interaction) {
    const plansLine = PRICING.plans.map((p) => `${p.name} | ${p.price}`).join('   ');
    const divider = '-'.repeat(52);
    const paymentList = PRICING.paymentMethods.map((m) => `- ${m}`).join('\n');

    const description = `${plansLine}\n${divider}\n**Payment Options:**\n${paymentList}`;

    await interaction.reply({ embeds: [infoEmbed(PRICING.title, description)] });
  }
};