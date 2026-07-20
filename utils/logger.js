const levels = { info: '\x1b[36m', warn: '\x1b[33m', error: '\x1b[31m', success: '\x1b[32m' };
const reset = '\x1b[0m';

function log(level, ...args) {
  const color = levels[level] || '';
  const tag = level.toUpperCase().padEnd(7);
  console.log(`${color}[${tag}]${reset}`, ...args);
}

module.exports = {
  info: (...args) => log('info', ...args),
  warn: (...args) => log('warn', ...args),
  error: (...args) => log('error', ...args),
  success: (...args) => log('success', ...args)
};
