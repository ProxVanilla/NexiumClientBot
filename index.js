const { Client, GatewayIntentBits, Partials } = require('discord.js');
const config = require('./config');
const { loadCommands } = require('./handlers/commandHandler');
const { loadEvents } = require('./handlers/eventHandler');
const { loadComponents } = require('./handlers/componentHandler');
require('./database/database'); // ensures the DB + schema are initialized on boot

if (!config.token || !config.clientId) {
  console.error('[boot] Missing DISCORD_TOKEN or CLIENT_ID in your .env file. Copy .env.example to .env and fill it in.');
  process.exit(1);
}

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMembers,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
    GatewayIntentBits.GuildMessageReactions
  ],
  partials: [Partials.Message, Partials.Channel, Partials.Reaction]
});

loadCommands(client);
loadComponents(client);
loadEvents(client);

client.login(config.token).catch((err) => {
  console.error('[boot] Failed to log in. Check your DISCORD_TOKEN.', err);
  process.exit(1);
});

process.on('unhandledRejection', (err) => console.error('[unhandledRejection]', err));
