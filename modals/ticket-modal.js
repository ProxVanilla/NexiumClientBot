// Example modal handler. Not wired to a command by default -
// show a ModalBuilder with customId "ticket-modal" to see this fire.
module.exports = {
  customId: 'ticket-modal',

  async execute(interaction) {
    const reason = interaction.fields.getTextInputValue('reason');
    await interaction.reply({ content: `Got it! Reason logged: ${reason}`, ephemeral: true });
  }
};
