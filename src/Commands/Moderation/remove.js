module.exports.execute = async (client, flag, arg, M) => {
    if (!M.mentions.length) return M.reply(`🟥 *Mentions are required to remove*`)
    const mentions = client.utils.removeDuplicates(M.mentions)
    if (mentions.length > 5)
        return M.reply(`🟥 *You can only remove up to 5 users at a time, Remove some users and try again*`)
    await client.groupParticipantsUpdate(M.from, mentions, 'remove').then((res) => {
        M.reply(`🟩 *Done! removing ${mentions.length} users*`)
    })
}

module.exports.command = {
    name: 'remove',
    aliases: ['rem'],
    exp: 10,
    category: 'moderation',
    usage: '[mention user | quote user]',
    description: 'Removes the taged user'
}
