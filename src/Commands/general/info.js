module.exports = {
    name: 'information',
    aliases: ['info'],
    category: 'general',
    exp: 0,
    description: 'Get information bot information',
    async execute(client, flag, arg, M) {
        const pad = (s) => (s < 10 ? '0' : '') + s
        const formatTime = (seconds) => {
            const hours = Math.floor(seconds / (60 * 60))
            const minutes = Math.floor((seconds % (60 * 60)) / 60)
            const secs = Math.floor(seconds % 60)
            return `${pad(hours)}:${pad(minutes)}:${pad(secs)}`
        }
        const uptime = formatTime(process.uptime())
        const groups = await client.getAllGroups()
        const users = await client.getAllUsers()
        return void (await M.reply(
            `💚 *UPTIME:* ${uptime}\n\n🌃 *USERS:* ${users.length}\n\n💬 *GROUPS* ${groups.length}\n\n🧧 *COMMANDS:* ${client.cmd.size}`
        ))
    }
}
