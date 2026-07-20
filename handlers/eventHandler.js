const fs = require('fs');
const path = require('path');

/**
 * Loads every file in /events and binds it to the client.
 * Each event file must export { name: 'eventName', once?: boolean, execute(...) }.
 */
function loadEvents(client) {
  const eventsDir = path.join(__dirname, '..', 'events');
  const files = fs.readdirSync(eventsDir).filter((f) => f.endsWith('.js'));

  for (const file of files) {
    const filePath = path.join(eventsDir, file);
    delete require.cache[require.resolve(filePath)];
    const event = require(filePath);

    if (!event?.name || !event?.execute) {
      console.warn(`[eventHandler] Skipping ${file} - missing "name" or "execute" export.`);
      continue;
    }

    if (event.once) {
      client.once(event.name, (...args) => event.execute(...args, client));
    } else {
      client.on(event.name, (...args) => event.execute(...args, client));
    }
  }

  console.log(`[eventHandler] Loaded ${files.length} events.`);
}

module.exports = { loadEvents };
