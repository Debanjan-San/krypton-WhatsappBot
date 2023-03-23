module.exports = {
    name: 'revoke',
    aliases: ['reset'],
    admin: true,
    public: false,
    botAdmin: true,
    category: 'moderation',
    description: 'Resets group link',
    async execute(client, arg, M) {
        await client.groupRevokeInvite(M.from)
        .then(res => {
            M.reply(`Done! Group link has been reset`)
        })
    }
}
