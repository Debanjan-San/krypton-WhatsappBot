const list = [
    {
        id: 'general',
        font: 'Gҽɳҽɾαʅ',
        emoji: '🔰'
    },
    {
        id: 'dev',
        font: 'Dҽʋ',
        emoji: '👨‍💻'
    },
    {
        id: 'fun',
        font: 'Fυɳ',
        emoji: '🎡'
    },
    {
        id: 'music',
        font: 'Mυʂιƈ',
        emoji: '💠'
    },
    {
        id: 'media',
        font: 'Mҽԃια',
        emoji: '🔉'
    },
    {
        id: 'moderation',
        font: 'Mσԃҽɾαƚισɳ',
        emoji: '💮'
    },
    {
        id: 'utils',
        font: 'Uƚιʅʂ',
        emoji: '⚙️'
    },
    {
        id: 'weeb',
        font: 'WҽҽႦ',
        emoji: '🎐'
    }
]

module.exports = {
    name: 'help',
    aliases: ['h', 'menu', 'list', 'commands'],
    category: 'general',
    exp: 10,
    description: 'Let you see the command list',
    async execute(client, flag, arg, M) {
        console.log(arg)
        if (!arg) {
            let obj = {}
            client.cmd.forEach((item) => {
                if (obj[item.category]) obj[item.category].push(item.name)
                else {
                    obj[item.category] = []
                    obj[item.category].push(item.name)
                }
            })
            let base = `⛩️ *❯──「Kɾყρƚσɳ」──❮* ⛩️

👋 *Hi @${M.sender.split('@')[0]}* 🍃!

🎋 *Support us by following us on instagram:*
https://www.instagram.com/das_abae

This help menu is designed to help you get started with the bot.`
            base += '\n\n ⟾ *📪Command list📪*'
            const keys = Object.keys(obj)
            for (const key of keys) {
                const data = list.find((x) => x.id.toLowerCase() === key.toLocaleLowerCase())
                base += `\n\n${data?.emoji} *❯──「${data?.font}」──❮* ${data?.emoji}\n➪ \`\`\`${obj[key].join(
                    ', '
                )}\`\`\``
            }
            base += '\n\n'
            base += `*📇 Notes:*
*➪ Use ${client.prefix}help <command name> from help the list to see its description and usage*
*➪ Eg: ${client.prefix}help profile*
*➪ <> means required and [ ] means optional, don't include <> or [ ] when using command.*`
            const url = 'https://i.pinimg.com/564x/3b/d8/bb/3bd8bb87812f4af49d6a52b7a2394c6d.jpg'
            const buffer = await client.utils.getBuffer(url)
            await client.sendMessage(
                M.from,
                {
                    image: buffer,
                    caption: base,
                    mentions: [M.sender]
                },
                {
                    quoted: M
                }
            )
            return
        }
        const command = client.cmd.get(arg) || client.cmd.find((cmd) => cmd.aliases && cmd.aliases.includes(arg))
        if (!command) return M.reply('Command does not exsist')
        M.reply(
            `*CMD INFO*\n\n*🟥 Name:* ${command.name}\n*🟩 Aliases:* ${command.aliases}\n*🟨 Desc:* ${command.description}`
        )
    }
}
