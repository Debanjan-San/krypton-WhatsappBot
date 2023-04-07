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
            const emojis = ['👨🏻‍💻', '💰', '🎃', '⚙️', '📽️', '🌀', '🎵', '🛠️', '🎊']
            const sortedCategories = Object.keys(categories).sort()
            const commandList = sortedCategories
                .map((category, index) => {
                    const commands = categories[category].join(', ')
                    const emoji = emojis[index % emojis.length]
                    return `${emoji} *${client.utils.capitalize(category)}*\n❐ ${commands}`
                })
                .join('\n\n')
            const message = `🎫 *${client.name}'s Command List* 🎫\n\n${commandList}\n\n🗃️ *Note:* _Use ${client.prefix}help <command_name> to view the command info_`
            return M.reply(message)
        }
        const command = client.cmd.get(arg) || client.cmd.find((cmd) => cmd.aliases && cmd.aliases.includes(arg))
        if (!command) return M.reply('Command not found')
        const message = `*CMD INFO*\n\n*🟥 Name:* ${command.name}\n*🟩 Aliases:* ${command.aliases.join(
            ', '
        )}\n*🟨 Desc:* ${command.description}`
        M.reply(message)
    }
}
