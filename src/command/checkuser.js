module.exports = {
    name: 'checkuser',
    aliases: [
        'awesomecheck',
        'greatcheck',
        'gaycheck',
        'cutecheck',
        'lesbiancheck',
        'hornycheck',
        'prettycheck',
        'lovelycheck',
        'uglycheck',
        'beautifulcheck',
        'handsomecheck',
        'charactercheck'
    ],
    exp: 10,
    category: 'fun',
    description: 'Checks on user',
    async execute(client, arg, M) {
        if (M.quoted?.participant) M.mentions.push(M.quoted.participant)
        if (!M.mentions.length) M.mentions.push(M.sender)
        if (M.cmdName == 'checkuser')
            return M.reply(
                `📛 *Check list*\n\n> awesomecheck\n> greatcheck\n> gaycheck\n> lesbiancheck\n> cutecheck\n> hornycheck\n> prettycheck\n> lovelycheck\n> uglycheck\n> beautifulcheck\n> handsomecheck\n> charactercheck\n\n _Check the things in list in you_ 💮`
            )
        const types = [
            'Compassionate',
            'Generous',
            'Grumpy',
            'Forgiving',
            'Obedient',
            'Good',
            'Simp',
            'Kind-Hearted',
            'patient',
            'UwU',
            'top, anyway',
            'Helpful'
        ]
        const character = types[Math.floor(Math.random() * types.length)]
        const percentage = Math.floor(Math.random() * 100) + 1
        const sentence = M.cmdName.split('check')
        const title = M.cmdName.toUpperCase()
        await client.sendMessage(
            M.from,
            {
                text: `*=======[${title}]=======*\n\n @${M.mentions[0].split('@')[0]} is ${
                    M.cmdName !== 'charactercheck' ? `${percentage}% ${sentence[0]}` : `${percentage}% ${character}`
                }`,
                mentions: [M.mentions[0]]
            },
            {
                quoted: M
            }
        )
    }
}
