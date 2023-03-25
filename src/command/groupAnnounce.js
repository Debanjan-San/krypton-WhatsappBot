module.exports = {
    name: 'group',
    aliases: ['gc'],
    admin: true,
    public: false,
    botAdmin: true,
    category: 'moderation',
    description: 'Closes or opens the group',
    async execute(client, arg, M) {
        const group = ['open', 'close']
        if (!arg && !group.includes(arg)) return M.reply('Sorry you did not give any search term!')
        const groupMetadata = await client.groupMetadata(M.from)
        switch (arg) {
            case 'open':
                if (!groupMetadata.announce) return M.reply('Already opened!')
                await client.groupSettingUpdate(M.from, 'not_announcement')
                return M.reply('Group opened')
                break
            case 'close':
                if (groupMetadata.announce) return M.reply('Already closed!')
                await client.groupSettingUpdate(M.from, 'announcement')
                return M.reply('Group Closed')
                break
        }
    },
}
