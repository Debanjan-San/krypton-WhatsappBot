module.exports = {
    name: 'promote',
    aliases: ['promo'],
    exp: 10,
    category: 'moderation',
    description: 'Promotes the taged user',
    async execute(client, arg, M) {
        if (M.quoted?.participant) M.mentions.push(M.quoted.participant)
        if (!M.mentions.length) return M.reply('You must tag the user before using!')
        const groupMetadata = await client.groupMetadata(M.from)
        const groupMembers = groupMetadata?.participants || []
        const groupAdmins = groupMembers.filter((v) => v.admin).map((v) => v.id)
        let NotadminUsers = []
        // Filter the users who are admin and push the not admin users in the users var
        M.mentions.filter((users) => (groupAdmins.includes(users) ? null : NotadminUsers.push(users)))
        await client.groupParticipantsUpdate(M.from, NotadminUsers, 'promote').then((res) => {
            M.reply(`Done! Promoting ${NotadminUsers.length} users`)
        })
    }
}
