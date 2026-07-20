module.exports = {
  name: 'guildMemberAdd',
  async execute(member) {
    console.log(`[guildMemberAdd] ${member.user.tag} joined ${member.guild.name}`);
    // Extend this to send welcome messages, auto-roles, etc.
  }
};
