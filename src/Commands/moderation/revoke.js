module.exports = {
    name: 'revoke',
    aliases: ['reset'],
    exp: 10,
    category: 'moderation',
    description: 'Resets group link',
    async execute(client, flag, arg, M) {
        await client.groupRevokeInvite(M.from).then((res) => {
            M.reply(`Done! Group link has been reset`)
        })
    }
}
