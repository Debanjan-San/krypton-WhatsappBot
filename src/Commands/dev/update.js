module.exports = {
    name: 'update',
    aliases: ['up'],
    category: 'dev',
    exp: 0,
    description: 'Updates the bot',
    async execute(client, arg, M) {
        M.reply('Updating...')
        await client.utils
            .term(
                'git remote set-url origin https://github.com/Debanjan-San/krypton-WhatsappBot.git && git pull origin main'
            )
            .then((res) => M.reply(res))
            .catch((err) => M.reply(err.message))
    }
}
