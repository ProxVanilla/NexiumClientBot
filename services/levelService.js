const db = require('../database/database');

const XP_PER_MESSAGE_MIN = 15;
const XP_PER_MESSAGE_MAX = 25;
const MESSAGE_COOLDOWN_MS = 60_000;

function xpForLevel(level) {
  return 5 * level ** 2 + 50 * level + 100;
}

function getUser(guildId, userId) {
  const row = db
    .prepare('SELECT * FROM levels WHERE guild_id = ? AND user_id = ?')
    .get(guildId, userId);

  if (row) return row;

  db.prepare(
    'INSERT INTO levels (guild_id, user_id, xp, level, last_message_at) VALUES (?, ?, 0, 0, 0)'
  ).run(guildId, userId);

  return { guild_id: guildId, user_id: userId, xp: 0, level: 0, last_message_at: 0 };
}

/**
 * Awards XP for a message, respecting a per-user cooldown.
 * Returns { leveledUp, newLevel } if a level-up occurred, otherwise null.
 */
function addMessageXp(guildId, userId) {
  const user = getUser(guildId, userId);
  const now = Date.now();
  if (now - user.last_message_at < MESSAGE_COOLDOWN_MS) return null;

  const gained = Math.floor(Math.random() * (XP_PER_MESSAGE_MAX - XP_PER_MESSAGE_MIN + 1)) + XP_PER_MESSAGE_MIN;
  let { xp, level } = user;
  xp += gained;

  let leveledUp = false;
  while (xp >= xpForLevel(level)) {
    xp -= xpForLevel(level);
    level += 1;
    leveledUp = true;
  }

  db.prepare(
    'UPDATE levels SET xp = ?, level = ?, last_message_at = ? WHERE guild_id = ? AND user_id = ?'
  ).run(xp, level, now, guildId, userId);

  return leveledUp ? { leveledUp, newLevel: level } : null;
}

function getRank(guildId, userId) {
  const all = db
    .prepare('SELECT user_id, xp, level FROM levels WHERE guild_id = ? ORDER BY level DESC, xp DESC')
    .all(guildId);

  const index = all.findIndex((r) => r.user_id === userId);
  return { rank: index === -1 ? null : index + 1, total: all.length, user: getUser(guildId, userId) };
}

function getLeaderboard(guildId, limit = 10) {
  return db
    .prepare('SELECT user_id, xp, level FROM levels WHERE guild_id = ? ORDER BY level DESC, xp DESC LIMIT ?')
    .all(guildId, limit);
}

module.exports = { getUser, addMessageXp, getRank, getLeaderboard, xpForLevel };
