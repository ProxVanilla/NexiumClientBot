// =====================================================================
// ✏️ EDIT THESE — categories shown in the /ticket-setup dropdown menu.
// value = internal id (used in channel names, keep lowercase/no spaces)
// label = shown in the dropdown
// emoji = shown next to the label
// description = shown under the label in the dropdown
// =====================================================================
const TICKET_CATEGORIES = [
  {
    value: 'support',
    label: 'Support',
    emoji: '🛠️',
    description: 'Request help about NexiumClient'
  },
  {
    value: 'media',
    label: 'Media',
    emoji: '🎵',
    description: 'Become an official media partner for NexiumClient'
  },
  {
    value: 'purchase',
    label: 'Purchase',
    emoji: '🛒',
    description: 'Buy NexiumClient'
  }
];

module.exports = { TICKET_CATEGORIES };
