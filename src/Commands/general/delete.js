module.exports.execute = async (client, flag, arg, M) => {
    if (!M.quoted) return M.reply('🟥 *Quote the message that you want me to delete, Baka!*')
    await client.sendMessage(M.from, {
        delete: M.quoted.key
    })
}

module.exports.command = {
    name: 'delete',
    aliases: ['del'],
    category: 'general',
    usage: '[quote the bot message]',
    exp: 5,
    description: 'Deletes the quoted message'
}
