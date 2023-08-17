module.exports.execute = async (client, flag, arg, M) => {
    if (!arg) return M.reply('🟥 *No query provided!*')
    let group = true
    let results = await client.getAllGroups()
    if (flag.includes('--users')) {
        arg = arg.replace('--users', '')
        group = false
        results = await client.getAllUsers()
    }
    for (const result of results) {
        const text = `*「 ${client.config.name.toUpperCase()} BROADCAST 」*\n\n${arg}\n\n`
        await client.sendMessage(result, {
            text,
            mentions: group ? (await client.groupMetadata(result)).participants.map((x) => x.id) : []
        })
    }
    M.reply(`🟩 Successfully Broadcast in ${results.length} ${group ? 'groups' : 'DMs'}`)
}

module.exports.command = {
    name: 'broadcast',
    aliases: ['bc'],
    category: 'dev',
    exp: 0,
    usage: '[text] | [text] --users',
    description: 'Will make a broadcast for groups where the bot is in. Can be used to make announcements'
}
