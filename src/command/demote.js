module.exports = {
    name: 'demote',
    aliases: ['demo'],
    admin: true,
    public: false,
    botAdmin: true,
    category: 'moderation',
    description: 'Promotes the taged user',
    async execute(client, arg, M) {
        if (M.mentions == 0) return M.reply('You must tag the user before using!')
        const groupMetadata = isGroup ? await client.groupMetadata(M.from) : null
        const groupMembers = groupMetadata?.participants || []
        const groupAdmins = groupMembers.filter((v) => v.admin)
            .map((v) => v.id)
        const users = [] 
        // Filter the users who are admin and push the not admin users in the users var
        M.mentions.filter(users => groupAdmins.includes(users) ?  users.push(users) : null);
        await client.groupParticipantsUpdate(M.from, users, 'demote')
        .then(res => {
            M.reply(`Done! Demoting ${users.length} users`)
        })
    }
}
