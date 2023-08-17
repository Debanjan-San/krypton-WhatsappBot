module.exports.execute = async (client, flag, arg, M) => {
    await client.groupRevokeInvite(M.from).then((res) => {
        M.reply(`🟩 *Done! Group link has been reset*`)
    })
}

module.exports.command = {
    name: 'revoke',
    aliases: ['reset'],
    exp: 10,
    usage: '',
    category: 'moderation',
    description: 'Resets group link'
}
