module.exports = {
    name: 'remove',
    aliases: ['rem'],
    exp: 10,
    category: 'moderation',
    description: 'Removes the taged user',
    async execute(client, flag, arg, M) {
        if (!M.mentions.length) return M.reply('You must tag the user before using!')
        await client.groupParticipantsUpdate(M.from, M.mentions, 'remove').then((res) => {
            M.reply(`Done! removing ${M.mentions.length} users`)
        })
    }
}
