// Example select menu handler. Not wired to a command by default -
// send a message with a StringSelectMenuBuilder using customId "example-menu"
// to see this fire.
module.exports = {
  customId: 'example-menu',

  async execute(interaction) {
    const [choice] = interaction.values;
    await interaction.reply({ content: `You selected: **${choice}**`, ephemeral: true });
  }
};
