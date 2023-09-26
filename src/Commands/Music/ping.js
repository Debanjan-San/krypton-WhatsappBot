module.exports.execute = async (client, flag, arg, M) => {
    await M.reply(`*_${client.utils.calculatePing(M.messageTimestamp, Date.now())} second(s)_*`)
}

module.exports.command = {
    name: 'ping',
    aliases: ['speed'],
    usage: '',
    category: 'music',
    exp: 1,
    description: 'Bot response in second'
}
