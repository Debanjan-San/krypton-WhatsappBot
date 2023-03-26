module.exports = {
    name: 'remove',
    aliases: ['rec'],
    admin: true,
    public: false,
    botAdmin: true,
    exp: 10,
    category: 'moderation',
    description: 'Removes the taged user',
    async execute(client, arg, M) {
        if (M.mentions.length == 0) return M.reply('You must tag the user before using!')
        await client.groupParticipantsUpdate(M.from, M.mentions, 'remove').then((res) => {
            M.reply(`Done! removing ${M.mentions.length} users`)
        })
    }
}
