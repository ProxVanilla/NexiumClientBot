const { SlashCommandBuilder, PermissionFlagsBits, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');
const db = require('../../database/database');
const { infoEmbed } = require('../../utils/embeds');
const { requireStaff } = require('../../utils/permissions');

function parseDuration(input) {
  const match = input.match(/^(\d+)(s|m|h|d)$/i);
  if (!match) return null;
  const [, amount, unit] = match;
  const multipliers = { s: 1000, m: 60_000, h: 3_600_000, d: 86_400_000 };
  return Number(amount) * multipliers[unit.toLowerCase()];
}

module.exports = {
  data: new SlashCommandBuilder()
    .setName('gstart')
    .setDescription('Start a giveaway.')
    .setDefaultMemberPermissions(PermissionFlagsBits.ManageGuild)
    .addStringOption((opt) => opt.setName('duration').setDescription('e.g. 30s, 10m, 2h, 1d').setRequired(true))
    .addStringOption((opt) => opt.setName('prize').setDescription('What are you giving away?').setRequired(true))
    .addIntegerOption((opt) => opt.setName('winners').setDescription('Number of winners').setMinValue(1).setMaxValue(20)),

  async execute(interaction) {
    if (!(await requireStaff(interaction))) return;

    const durationInput = interaction.options.getString('duration');
    const prize = interaction.options.getString('prize');
    const winnerCount = interaction.options.getInteger('winners') || 1;

    const durationMs = parseDuration(durationInput);
    if (!durationMs) {
      return interaction.reply({ content: 'Invalid duration format. Use e.g. `30s`, `10m`, `2h`, `1d`.', ephemeral: true });
    }

    const endsAt = Date.now() + durationMs;
    const embed = infoEmbed('🎉 Giveaway', `**Prize:** ${prize}\n**Winners:** ${winnerCount}\nEnds: <t:${Math.floor(endsAt / 1000)}:R>\n\nClick 🎉 below to enter!`);
    const row = new ActionRowBuilder().addComponents(
      new ButtonBuilder().setCustomId('giveaway-enter').setLabel('Enter Giveaway').setEmoji('🎉').setStyle(ButtonStyle.Success)
    );

    const message = await interaction.channel.send({ embeds: [embed], components: [row] });

    db.prepare(
      'INSERT INTO giveaways (guild_id, channel_id, message_id, prize, winner_count, host_id, ends_at, ended) VALUES (?, ?, ?, ?, ?, ?, ?, 0)'
    ).run(interaction.guild.id, interaction.channel.id, message.id, prize, winnerCount, interaction.user.id, endsAt);

    await interaction.reply({ content: 'Giveaway started!', ephemeral: true });
  }
};
