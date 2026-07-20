# NexiumClient

🟣 A modular, purple-themed Discord bot for the **NexiumClient** server, built with
discord.js v14. Features tickets, staff-role-based moderation, giveaways, crypto
price lookups, a leveling/XP system, and member verification — backed by SQLite
(via `better-sqlite3`, no external database server required).

- **Staff roles:** `mod`, `Drmelonn`, `Nexium` — anyone holding one of these roles
  can use staff commands, regardless of their raw Discord permissions.
- **Verified role:** `Member` — granted via the `/verify-setup` panel.
- **Theme:** purple (`#9B59B6`) on all embeds.

## Structure

```
NexiumClientBot/
├── index.js                 # Entry point: creates the client, loads everything, logs in
├── config.js                # Central config, reads from .env
├── .env.example              # Copy to .env and fill in your values
├── database/
│   ├── database.js          # Opens the SQLite connection, applies schema.sql on boot
│   ├── schema.sql            # Table definitions
│   └── migrations/           # Drop numbered .sql files here for manual schema changes
├── handlers/
│   ├── commandHandler.js     # Loads commands/*/*.js, also deploys slash commands to Discord
│   ├── eventHandler.js       # Loads events/*.js and binds them to the client
│   └── componentHandler.js   # Loads buttons/, menus/, modals/ and routes interactions
├── events/                   # discord.js client events (ready, interactionCreate, ...)
├── commands/                 # Slash commands, grouped by category (folder = category)
│   ├── admin/                # /config, /verify-setup
│   ├── moderation/
│   ├── tickets/
│   ├── giveaway/
│   ├── prices/
│   ├── levels/
│   └── utility/
├── buttons/                  # Button interaction handlers (customId -> execute)
├── menus/                    # Select menu interaction handlers
├── modals/                   # Modal submit handlers
├── utils/                     # Embeds, logger, small helpers
├── services/                  # Business logic: priceService (CoinGecko), levelService (XP)
└── assets/                    # Images/fonts/etc for the bot to reference
```

> Note: the original spec listed a second, empty `database/` folder alongside
> `buttons/`, `menus/`, `modals/`. That looked like a duplicate of the top-level
> `database/` folder, so it's been merged into the one at the root — all DB code
> lives there.

## Setup

1. **Install dependencies**
   ```bash
   npm install
   ```

2. **Create a Discord application**
   - Go to https://discord.com/developers/applications, create an application + bot.
   - Copy the **Bot Token** and the **Application (Client) ID**.
   - Under *Bot > Privileged Gateway Intents*, enable **Server Members Intent** and
     **Message Content Intent** (needed for leveling and welcome events).

3. **Configure environment variables**
   ```bash
   cp .env.example .env
   ```
   Fill in `DISCORD_TOKEN`, `CLIENT_ID`, and `GUILD_ID` (your test server's ID, for
   instant command updates during development).

4. **Deploy slash commands**
   ```bash
   npm run deploy
   ```
   With `DEPLOY_GUILD_ONLY=true`, commands appear instantly in `GUILD_ID`. Set it to
   `false` (and leave `GUILD_ID` blank) to deploy globally once you're ready to go live
   — global commands can take up to an hour to propagate.

5. **Run the bot**
   ```bash
   npm start
   ```

## Adding new commands

Drop a file in the right `commands/<category>/` folder:

```js
const { SlashCommandBuilder } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder().setName('example').setDescription('Says hi'),
  async execute(interaction) {
    await interaction.reply('Hi!');
  }
};
```

Re-run `npm run deploy` any time you add, remove, or change a command's options.

## Adding buttons / menus / modals

Same pattern — export `customId` (a string, or a `RegExp` for dynamic ids like
`ticket-close-<channelId>`) and `execute(interaction, client)` in `buttons/`,
`menus/`, or `modals/`. They're picked up automatically on boot.

## Feature notes

- **Staff roles**: `utils/permissions.js` exports `requireStaff(interaction)`, used
  at the top of every admin/moderation/giveaway command. It passes if the member
  holds one of `config.staffRoleNames` (`mod`, `Drmelonn`, `Nexium` by default,
  edit `STAFF_ROLE_NAMES` in `.env` to change). This is *in addition to* each
  command's native `setDefaultMemberPermissions()`, which still controls whether
  the command even shows up for a member in Discord's UI.
- **Verification**: `/verify-setup` (staff only) posts a panel in the current
  channel; the "Verify" button grants the role named `Member` (`VERIFIED_ROLE_NAME`
  in `.env`). Make sure that role already exists in the server and sits below the
  bot's own role, or the button will report an error.
- **Tickets**: `/ticket-setup` posts a panel; the "Open Ticket" button creates a
  private channel and stores it in the `tickets` table; `/ticket-close` or the
  in-channel "Close Ticket" button closes and deletes it.
- **Giveaways**: `/gstart` posts an entry-button giveaway; `/gend` picks winners
  early; `/greroll` repicks a winner from an ended giveaway. There's no background
  scheduler included — wire a `setInterval`/cron in `index.js` if you want giveaways
  to auto-end at `ends_at` without a manual `/gend`.
- **Prices**: `/price <coin>` hits CoinGecko's free public API (no key required) for
  USD price + 24h change, with a 60s in-memory cache.
- **Levels**: XP is granted per message (with a 60s cooldown) via `messageCreate`;
  `/rank` and `/leaderboard` read from the `levels` table.

## Deploying to GitHub

```bash
git init
git add .
git commit -m "Initial commit: NexiumClientBot scaffold"
git branch -M main
git remote add origin https://github.com/<your-username>/NexiumClientBot.git
git push -u origin main
```

`.env` and the SQLite database file are already excluded via `.gitignore` — never
commit your bot token.
