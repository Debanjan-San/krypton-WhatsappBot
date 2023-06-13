module.exports = {
    name: 'ban',
    aliases: ['b'],
    exp: 0,
    category: 'dev',
    description: 'Bans the taged user',
    async execute(client, flag, arg, M) {
        if (M.quoted?.participant) M.mentions.push(M.quoted.participant)
        if (!M.mentions.length) return M.reply('You must tag the user before using!')
        const banned = (await client.DB.get('banned')) || []
        M.mentions.filter(async (user) =>
            !banned.includes(user)
                ? (await client.DB.push('banned', user)) &&
                  (await client.sendMessage(
                      M.from,
                      { text: `*@${user.split('@')[0]}* is now banned`, mentions: [user] },
                      { quoted: M }
                  ))
                : await client.sendMessage(
                      M.from,
                      { text: `*@${user.split('@')[0]}* is already banned`, mentions: [user] },
                      { quoted: M }
                  )
        )
    }
}
