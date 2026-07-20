const db = require('../database/database');

module.exports = {
  customId: 'giveaway-enter',

  async execute(interaction) {
    const giveaway = db.prepare('SELECT * FROM giveaways WHERE message_id = ? AND ended = 0').get(interaction.message.id);

    if (!giveaway) {
      return interaction.reply({ content: 'This giveaway has already ended.', ephemeral: true });
    }

    const already = db
      .prepare('SELECT 1 FROM giveaway_entries WHERE giveaway_id = ? AND user_id = ?')
      .get(giveaway.id, interaction.user.id);

    if (already) {
      return interaction.reply({ content: 'You\'ve already entered this giveaway. Good luck!', ephemeral: true });
    }

    db.prepare('INSERT INTO giveaway_entries (giveaway_id, user_id) VALUES (?, ?)').run(giveaway.id, interaction.user.id);
    await interaction.reply({ content: '🎉 You\'re entered! Good luck!', ephemeral: true });
  }
};
