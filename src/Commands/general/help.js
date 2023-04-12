module.exports = {
    name: 'help',
    aliases: ['h', 'menu', 'list'],
    category: 'general',
    exp: 10,
    description: 'Displays the command list or specific command info',
    async execute(client, arg, M) {
        if (!arg) {
            const categories = client.cmd.reduce((obj, cmd) => {
                const category = cmd.category || 'Uncategorized'
                obj[category] = obj[category] || []
                obj[category].push(cmd.name)
                return obj
            }, {})
            const emojis = ['👨🏻‍💻', '💰', '🎃', '⚙️', '📽️', '🌀', '🎵', '🛹', '🛠️', '🎊']
            const commandList = Object.keys(categories)
            let commands = ''
            for (const category of commandList) {
                commands += `\n${emojis[commandList.indexOf(category)]} *${client.utils.capitalize(
                    category,
                    true
                )} COMMANDS:*\n\n${categories[category].map((cmd, index) => `${index + 1}| *${client.prefix}${cmd}* \n- ${client.cmd.get(cmd).description}\n`).join( '\n')}\n`
            }

            const message = `~ <× [ *—͟͞͞${client.utils.capitalize(client.name)}* ] ×> ~\n\nHey 👋 ${
                M.pushName
            } *(>❤️ω❤️)>*\nI am ${client.utils.capitalize(
                client.name
            )} I am here to make your WhatsApp 🎋 experience better ~\n\n*———————↝ LINKS ↜———————*\n\n*Please fork and star ⭐️ my repo and don’t forget to like my video tutorial 🍃*\n\n🥢 *Tutorial:*\nhttps://youtu.be/6P1Ya6ByEYQ\n\n📗 *Repo:*\nhttps://github.com/Debanjan-San/krypton-WhatsappBot\n\n⛩ *Follow My* \n*Instagram:* das_abae\n\n💈 *Link:*\nhttps://instagram.com/das_abae?igshid=YmMyMTA2M2Y=\n\n\t\t\t\t*🎐COMMANDS🎐*\n\n${commands}\n📚 Use ${client.prefix}help <command_name> to view the full info. \n🔖 _Eg: ${client.prefix}help promote_`
            const url =
                'https://camo.githubusercontent.com/ba1eb0374c0193222b7003d9ce1642ab1f3a138a307ec22de39cf2599a53a12c/68747470733a2f2f692e6962622e636f2f5a67725377354c2f55525548412d5255534849412e6a7067'
            const buffer = await client.utils.getBuffer(url)
            await client.sendMessage(
                M.from,
                {
                    video: {
                        url: 'https://media.tenor.com/9X1bdbB1N4AAAAPo/kawaii-anime-girl.mp4'
                    },
                    gifPlayback: true,
                    caption: message,
                    contextInfo: {
                        externalAdReply: {
                            title: 'WhatsApp Bot',
                            body: 'Krypton wbot by Das',
                            sourceUrl: 'shorturl.at/gvU39',
                            thumbnail: buffer,
                            mediaType: 1
                        }
                    }
                },
                {
                    quoted: M
                }
            )
            return
        }
        const command = client.cmd.get(arg) || client.cmd.find((cmd) => cmd.aliases && cmd.aliases.includes(arg))
        if (!command) return M.reply('Command not found')
        const message = `*CMD INFO*\n\n*🟥 Name:* ${command.name}\n*🟩 Aliases:* ${command.aliases.join(
            ', '
        )}\n*🟨 Desc:* ${command.description}`
        M.reply(message)
    }
}