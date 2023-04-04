module.exports = {
    name: 'remove',
    aliases: ['rem'],
    exp: 10,
    category: 'moderation',
    description: 'Removes the taged user',
    async execute(client, arg, M) {
        if (M.quoted?.participant) M.mentions.push(M.quoted.participant)
        if (!M.mentions.length) return M.reply('You must tag the user before using!')
        await client.groupParticipantsUpdate(M.from, M.mentions, 'remove').then((res) => {
            M.reply(`Done! removing ${M.mentions.length} users`)
        })
    }
}
