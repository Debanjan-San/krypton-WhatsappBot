module.exports.execute = async (client, flag, arg, M) => {
    M.reply('Restarting...')
    await client.utils.restart()
}

module.exports.command = {
    name: 'restart',
    aliases: ['relife'],
    category: 'dev',
    exp: 0,
    usage: '',
    description: 'Restarts the bot'
}
