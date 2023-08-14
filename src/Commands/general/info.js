module.exports = {
    name: 'information',
    aliases: ['info'],
    category: 'general',
    exp: 0,
    description: 'Get information bot information',
    async execute(client, flag, arg, M) {
        const uptime = client.utils.formatSeconds(process.uptime())
        const groups = await client.getAllGroups()
        const users = await client.getAllUsers()
        return void (await M.reply(
            `💚 *UPTIME:* ${uptime}\n\n🌃 *USERS:* ${users.length}\n\n💬 *GROUPS* ${groups.length}\n\n🧧 *COMMANDS:* ${client.cmd.size}`
        ))
    }
}
