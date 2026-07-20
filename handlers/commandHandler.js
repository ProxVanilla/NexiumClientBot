const fs = require('fs');
const path = require('path');
const { REST, Routes, Collection } = require('discord.js');
const config = require('../config');

/**
 * Recursively walks commands/<category>/*.js and returns a flat list
 * of { filePath, category } for every command file found.
 */
function walkCommandFiles(dir) {
  const results = [];
  const categories = fs.readdirSync(dir, { withFileTypes: true }).filter((d) => d.isDirectory());

  for (const categoryDir of categories) {
    const categoryPath = path.join(dir, categoryDir.name);
    const files = fs.readdirSync(categoryPath).filter((f) => f.endsWith('.js'));
    for (const file of files) {
      results.push({ filePath: path.join(categoryPath, file), category: categoryDir.name });
    }
  }
  return results;
}

/**
 * Loads every command into client.commands (a Collection keyed by command name).
 * Each command file must export { data: SlashCommandBuilder, execute(interaction) }.
 */
function loadCommands(client) {
  client.commands = new Collection();
  const commandsDir = path.join(__dirname, '..', 'commands');
  const commandFiles = walkCommandFiles(commandsDir);

  for (const { filePath, category } of commandFiles) {
    delete require.cache[require.resolve(filePath)];
    const command = require(filePath);

    if (!command?.data || !command?.execute) {
      console.warn(`[commandHandler] Skipping ${filePath} - missing "data" or "execute" export.`);
      continue;
    }

    command.category = category;
    client.commands.set(command.data.name, command);
  }

  console.log(`[commandHandler] Loaded ${client.commands.size} commands.`);
  return client.commands;
}

/**
 * Registers (deploys) all slash commands with Discord's API.
 * Run with: node handlers/commandHandler.js --deploy
 */
async function deployCommands() {
  const commandsDir = path.join(__dirname, '..', 'commands');
  const commandFiles = walkCommandFiles(commandsDir);
  const body = [];

  for (const { filePath } of commandFiles) {
    const command = require(filePath);
    if (command?.data) body.push(command.data.toJSON());
  }

  const rest = new REST({ version: '10' }).setToken(config.token);

  const route =
    config.deployGuildOnly && config.guildId
      ? Routes.applicationGuildCommands(config.clientId, config.guildId)
      : Routes.applicationCommands(config.clientId);

  console.log(`[commandHandler] Deploying ${body.length} commands...`);
  await rest.put(route, { body });
  console.log('[commandHandler] Successfully deployed commands.');
}

if (require.main === module && process.argv.includes('--deploy')) {
  deployCommands().catch((err) => {
    console.error('[commandHandler] Failed to deploy commands:', err);
    process.exit(1);
  });
}

module.exports = { loadCommands, deployCommands, walkCommandFiles };
