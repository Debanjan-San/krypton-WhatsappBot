module.exports = {
    name: 'delete',
    aliases: ['del'],
    category: 'music',
    exp: 5,
    description: 'Deletes bots message',
    async execute(client, arg, M) {
        if (M?.quoted?.isSelf) return await M.quoted.delete()
        else return M.reply('Please, reply to message sent by bot')
    }
}
