module.exports = {
    name: 'join',
    aliases: ['add'],
    category: 'dev',
    exp: 0,
    description: 'Bot joins the group using the link',
    async execute(client, flag, arg, M) {
        if (!M.urls) return M.reply('Sorry you did not give any group link!')
        if (!M.urls[0].includes('whatsapp.com')) return M.reply('Sorry you did not give any valid group link!')
        const JoinCode = arg.split('https://chat.whatsapp.com/')[1]
        client
            .groupAcceptInvite(JoinCode)
            .then((res) => M.reply('Joined'))
            .catch((res) => M.reply('Something went wrong please check the link'))
    }
}
