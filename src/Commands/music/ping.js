module.exports = {
    name: 'ping',
    aliases: ['speed'],
    category: 'music',
    exp: 1,
    description: 'Bot response in second',
    async execute(client, flag, arg, M) {
        await M.reply(`*_${client.utils.calculatePing(M.messageTimestamp, Date.now())} second(s)_*`)
    }
}
