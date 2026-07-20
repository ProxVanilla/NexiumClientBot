const { findHandler } = require('../handlers/componentHandler');

module.exports = {
  name: 'interactionCreate',
  async execute(interaction, client) {
    try {
      if (interaction.isChatInputCommand()) {
        const command = client.commands.get(interaction.commandName);
        if (!command) return;
        await command.execute(interaction, client);
        return;
      }

      if (interaction.isButton()) {
        const handler = findHandler(client.buttons, interaction.customId);
        if (handler) await handler.execute(interaction, client);
        return;
      }

      if (interaction.isStringSelectMenu() || interaction.isAnySelectMenu?.()) {
        const handler = findHandler(client.menus, interaction.customId);
        if (handler) await handler.execute(interaction, client);
        return;
      }

      if (interaction.isModalSubmit()) {
        const handler = findHandler(client.modals, interaction.customId);
        if (handler) await handler.execute(interaction, client);
        return;
      }

      if (interaction.isAutocomplete()) {
        const command = client.commands.get(interaction.commandName);
        if (command?.autocomplete) await command.autocomplete(interaction, client);
        return;
      }
    } catch (err) {
      console.error(`[interactionCreate] Error handling interaction:`, err);
      const payload = { content: 'Something went wrong while processing that.', ephemeral: true };

      if (interaction.isRepliable?.()) {
        if (interaction.deferred || interaction.replied) {
          await interaction.followUp(payload).catch(() => {});
        } else {
          await interaction.reply(payload).catch(() => {});
        }
      }
    }
  }
};
