module.exports.execute = async (client, flag, arg, M) => {
    const group = ['open', 'close']
    if (!group.includes(arg)) return M.reply('📢  *Choose the mode!!*')
    const groupMetadata = await client.groupMetadata(M.from)
    switch (arg) {
        case 'open':
            if (!groupMetadata.announce) return M.reply('📢 *Group is alrady in Not_Announce mode*')
            await client.groupSettingUpdate(M.from, 'not_announcement')
            return M.reply('📢 *Group is in Not_Announce mode*')
            break
        case 'close':
            if (groupMetadata.announce) return M.reply('📢 *Group is alrady in Announce mode*')
            await client.groupSettingUpdate(M.from, 'announcement')
            return M.reply('📢 *Group is in Not_Announce mode*')
            break
    }
}

module.exports.command = {
    name: 'group',
    aliases: ['gc'],
    exp: 5,
    usage: 'open | close',
    category: 'moderation',
    description: 'Closes or opens the group'
}
