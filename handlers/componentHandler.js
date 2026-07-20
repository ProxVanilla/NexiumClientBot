const fs = require('fs');
const path = require('path');
const { Collection } = require('discord.js');

/**
 * Loads buttons/, menus/, and modals/ into client.buttons, client.menus, client.modals.
 * Each file must export { customId: string | RegExp, execute(interaction) }.
 * A string customId requires an exact match; a RegExp customId is tested with .test().
 */
function loadComponentDir(dirName) {
  const dir = path.join(__dirname, '..', dirName);
  const collection = new Collection();

  if (!fs.existsSync(dir)) return collection;

  const files = fs.readdirSync(dir).filter((f) => f.endsWith('.js'));
  for (const file of files) {
    const filePath = path.join(dir, file);
    delete require.cache[require.resolve(filePath)];
    const component = require(filePath);

    if (!component?.customId || !component?.execute) {
      console.warn(`[componentHandler] Skipping ${dirName}/${file} - missing "customId" or "execute" export.`);
      continue;
    }

    collection.set(component.customId.toString(), component);
  }
  return collection;
}

function loadComponents(client) {
  client.buttons = loadComponentDir('buttons');
  client.menus = loadComponentDir('menus');
  client.modals = loadComponentDir('modals');

  console.log(
    `[componentHandler] Loaded ${client.buttons.size} buttons, ${client.menus.size} menus, ${client.modals.size} modals.`
  );
}

/**
 * Finds a matching handler for a given customId, supporting both exact
 * string matches and RegExp-based matches (for dynamic ids like "ticket-close-123").
 */
function findHandler(collection, customId) {
  if (collection.has(customId)) return collection.get(customId);

  for (const handler of collection.values()) {
    if (handler.customId instanceof RegExp && handler.customId.test(customId)) {
      return handler;
    }
  }
  return null;
}

module.exports = { loadComponents, findHandler };
