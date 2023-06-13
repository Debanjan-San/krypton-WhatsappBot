module.exports = {
    name: 'demote',
    aliases: ['demo'],
    exp: 5,
    category: 'moderation',
    description: 'Demotes the taged user',
    async execute(client, flag, arg, M) {
        if (!M.mentions.length) return M.reply('You must tag the user before using!')
        const groupMetadata = await client.groupMetadata(M.from)
        const groupMembers = groupMetadata?.participants || []
        const groupAdmins = groupMembers.filter((v) => v.admin).map((v) => v.id)
        let adminUsers = []
        // Filter the users who are admin and push the not admin users in the users var
        M.mentions.filter((users) => (groupAdmins.includes(users) ? adminUsers.push(users) : null))
        await client.groupParticipantsUpdate(M.from, adminUsers, 'demote').then((res) => {
            M.reply(`Done! Demoting ${adminUsers.length} users`)
        })
    }
}
