module.exports.execute = async (client, flag, arg, M) => {
    if (!M.mentions) return M.reply(`🟥 *Mentions are required to promote*`)
    if (M.mentions.length > 5)
        return M.reply(`🟥 *You can only promote up to 5 users at a time, Remove some users and try again*`)
    const groupMetadata = await client.groupMetadata(M.from)
    const groupMembers = groupMetadata?.participants || []
    const groupAdmins = groupMembers.filter((v) => v.admin).map((v) => v.id)
    let NotadminUsers = []
    // Filter the users who are admin and push the not admin users in the users var
    M.mentions.filter((users) => (groupAdmins.includes(users) ? null : NotadminUsers.push(users)))
    await client.groupParticipantsUpdate(M.from, NotadminUsers, 'promote').then((res) => {
        M.reply(`🟩 *Done! Promoting ${NotadminUsers.length} users*`)
    })
}

module.exports.command = {
    name: 'promote',
    aliases: ['promo'],
    exp: 10,
    category: 'moderation',
    usage: '[mention user | quote user]',
    description: 'Promotes the taged user'
}
