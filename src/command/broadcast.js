module.exports = {
    name: 'broadcast',
    aliases: ['bc'],
    category: 'dev',
    exp: 0,
    description: 'Will make a broadcast for groups where the bot is in. Can be used to make announcements',
    async execute(client, arg, M) {
        if (!arg) return M.reply('No query provided!')
        const getGroups = await client.groupFetchAllParticipating()
        const groups = Object.entries(getGroups)
            .slice(0)
            .map((entry) => entry[1])
        const res = groups.map((v) => v.id)
        M.reply(`Broadcasting in ${res.length} Group Chat, in ${res.length * 1.5} seconds`)
        for (let i of res) {
            const groupMetadata = await client.groupMetadata(i)
            const groupMembers = groupMetadata?.participants.map((x) => x.id) || []
            const text = `🔰*「 ${client.name.toUpperCase()} BROADCAST 」*🔰\n\n🏮 Message: ${arg}`
            await client.sendMessage(i, {
                video: {
                    url: 'https://media.tenor.com/AtXbqlrwklIAAAPo/anime-tv.mp4'
                },
                gifPlayback: true,
                mentions: groupMembers,
                caption: `${text}`
            })
        }
        M.reply(`✅ Broadcast Message sent to *${res.length} groups*.`)
    }
}
//M.quoted.mtype === 'imageMessage',
