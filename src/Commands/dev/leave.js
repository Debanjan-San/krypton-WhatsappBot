module.exports.execute = async (client, flag, arg, M) => {
    client.groupLeave(M.from).catch((res) => M.reply('🟥 *Something went wrong please check the link*'))
}

module.exports.command = {
    name: 'leave',
    aliases: ['bye'],
    category: 'dev',
    usage: '',
    exp: 0,
    description: 'Bot leaves the group'
}
