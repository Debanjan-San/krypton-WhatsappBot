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
                )}*\n\n${categories[category].map((cmd) => `• _${client.prefix}${cmd}_`).join('\n')}\n`
            }

            const message = `~ <× [ *—͟͞͞${client.utils.capitalize(client.name)}* ] ×> ~\n\n*Hey 👋 ${
                M.pushName
            } (>❤️ω❤️)>*\n*I am ${client.utils.capitalize(
                client.name
            )}*\n*I am here to make*\n*your WhatsApp* 🎋\n*experience better ~*\n\n*—————↝ LINKS ↜—————*\n\n*Please fork and star* ⭐️\n*my repo and don’t forget to* \n*like my video tutorial 🍃*\n\n🥢 *Tutorial:*\nyoutu.be/6P1Ya6ByEYQ\n\n📗 *Repo:*\nshorturl.at/gvU39\n\n⛩ *Follow My* \n*Instagram: das_abae*\n\n💈*Link:*\ninstagram.com/das_abae\n\n*🎐COMMANDS🎐*\n\n${commands}\n🗃️ *Note:* _Use ${
                client.prefix
            }help <command_name>\nto view the command info_`
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
