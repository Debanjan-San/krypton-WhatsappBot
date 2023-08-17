module.exports.execute = async (client, flag, arg, M) => {
    if (M.mentioned.length === 0) return M.reply(`🟥 *Mentions are required to demote*`)
    if (M.mentioned.length > 5)
        return M.reply(`🟥 *You can only demote up to 5 users at a time, Remove some users and try again*`)
    const groupMetadata = await client.groupMetadata(M.from)
    const groupMembers = groupMetadata?.participants || []
    const groupAdmins = groupMembers.filter((v) => v.admin).map((v) => v.id)
    let adminUsers = []
    // Filter the users who are admin and push the not admin users in the users var
    M.mentions.filter((users) => (groupAdmins.includes(users) ? adminUsers.push(users) : null))
    await client.groupParticipantsUpdate(M.from, adminUsers, 'demote').then((res) => {
        M.reply(`🟩 *Done! Demoting ${adminUsers.length} users*`)
    })
}

module.exports.command = {
    name: 'demote',
    aliases: ['demo'],
    exp: 5,
    category: 'moderation',
    usage: '[mention user | quote user]',
    description: 'Demotes the taged user'
}
