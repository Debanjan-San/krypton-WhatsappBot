module.exports = {
    name: 'help',
    aliases: ['h', 'menu', 'list', 'commands'],
    category: 'general',
    exp: 10,
    description: 'Let you see the command list',
    async execute(client, arg, M) {
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
            const emojis = ['🌀', '🎴', '🔮', '👑', '🎈', '⚙️', '🍀', '🎵']
            let text = `🎫 *${client.name}'s Command List* 🎫\n\n`
            const keys = Object.keys(obj)
            for (const key of keys)
                text += `${emojis[keys.indexOf(key)]} *${client.utils.capitalize(key)}*\n❐ \`\`\`${obj[key].join(
                    ', '
                )}\`\`\`\n\n`
            return M.reply(text + `🗃️ *Note: Use ${client.prefix}help <command_name> to view the command info*`)
        }
        const command = client.cmd.get(arg) || client.cmd.find((cmd) => cmd.aliases && cmd.aliases.includes(arg))
        if (!command) return M.reply('Command does not exsist')
        M.reply(
            `*CMD INFO*\n\n*🟥 Name:* ${command.name}\n*🟩 Aliases:* ${command.aliases}\n*🟨 Desc:* ${command.description}`
        )
    }
}
