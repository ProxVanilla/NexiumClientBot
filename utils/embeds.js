const { EmbedBuilder } = require('discord.js');
const config = require('../config');

function baseEmbed() {
  return new EmbedBuilder().setColor(config.embedColor).setTimestamp();
}

function successEmbed(description) {
  return baseEmbed().setDescription(`✅ ${description}`);
}

function errorEmbed(description) {
  return baseEmbed().setColor('#ED4245').setDescription(`❌ ${description}`);
}

function infoEmbed(title, description) {
  return baseEmbed().setTitle(title).setDescription(description);
}

module.exports = { baseEmbed, successEmbed, errorEmbed, infoEmbed };
