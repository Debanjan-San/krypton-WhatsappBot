module.exports = {
    name: 'promote',
    aliases: ['promo'],
    admin: true,
    public: false,
    botAdmin: true,
    description: 'Promotes the taged user',
    async execute(client, arg, M) {
        if (M.mentions == 0) return M.reply('You must tag the user before using!')
        const groupMetadata = isGroup ? await client.groupMetadata(M.from) : null
        const groupMembers = groupMetadata?.participants || []
        const groupAdmins = groupMembers.filter((v) => v.admin)
            .map((v) => v.id)
        const users = [] 
        // Filter the users who are admin and push the not admin users in the users var
        M.mentions.filter(users => groupAdmins.includes(users) ?  null : users.push(users));
        await client.groupParticipantsUpdate(M.from, users, 'promote')
        .then(res => {
            M.reply(`Done! Promoting ${users.length} users`)
        })
    }
}