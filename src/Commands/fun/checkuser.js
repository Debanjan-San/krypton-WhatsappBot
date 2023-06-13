// prettier-ignore
const checks = ['awesomecheck', 'greatcheck', 'gaycheck', 'cutecheck', 'lesbiancheck', 'hornycheck', 'prettycheck', 'lovelycheck', 'uglycheck', 'beautifulcheck', 'handsomecheck', 'charactercheck']

module.exports = {
    name: 'checkuser',
    aliases: ['cu', ...checks],
    exp: 10,
    category: 'fun',
    description: 'Checks on user',
    async execute(client, flag, arg, M) {
        const text = arg.trim()
        const command = M.body.split(' ')[0].toLowerCase().slice(client.prefix.length).trim()
        if (command == 'checkuser' || command == 'cu')
            if (!text) {
                const CheckList = `🎃 *Available Checks:*\n\n- ${checks
                    .map((check) => client.utils.capitalize(check))
                    .join('\n- ')}\n🛠️ *Usage:* ${client.prefix}check [tag/quote user] | ${
                    client.prefix
                }(check) [tag/quote user]\nExample: ${client.prefix}awesomecheck`
                return await M.reply(CheckList)
            }
        if (M.quoted?.participant) M.mentions.push(M.quoted.participant)
        if (!M.mentions.length) M.mentions.push(M.sender)
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
        const sentence = command.split('check')
        const title = command.toUpperCase()
        await client.sendMessage(
            M.from,
            {
                text: `*=======[${title}]=======*\n\n @${M.mentions[0].split('@')[0]} is ${
                    command !== 'charactercheck' ? `${percentage}% ${sentence[0]}` : `${percentage}% ${character}`
                }`,
                mentions: [M.mentions[0]]
            },
            {
                quoted: M
            }
        )
    }
}
