module.exports = {
    name: 'help',
    aliases: ['h', 'menu', 'list', 'commands'],
    category: 'general'
    description: 'Let you see the command list',
    async execute(client, arg, M) {
        console.log(arg)
        if (!arg) {
            return M.reply(`Hey ${M.pushName} krypton\n This bot is made using JS and framework is nodeJS and using OpenAI for chat service\n\n   *CMD*   \n\n>Help\n>Alive\n>Gpt\n>Google\n>trendinganime\n>Waifu\n>Demote\n>Promote\n\nUse !help <command name> to seemore info`)
        }
        const command =
            client.cmd.get(arg) ||
            client.cmd.find((cmd) => cmd.aliases && cmd.aliases.includes(arg))
        if (!command) return M.reply("Command does not exsist")
        M.reply(`*CMD INFO*\n\n*Name> _${command.name}_*\n*Aliases> _${command.aliases}_*\n*Desc> _${command.description}_*`)
    }
}
