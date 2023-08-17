const os = require('os')

module.exports.execute = async (client, flag, arg, M) => {
    let cpus = os.cpus(),
        text =
            `*Server:*\n\n- Nodejs: ${process.version}\n- Memory: ${
                client.utils.formatSize(os.totalmem() - os.freemem()) + '/' + client.utils.formatSize(os.totalmem())
            }\n` +
            `- CPU: ${cpus[0].model} ${cpus.length > 1 ? `(${cpus.length} core)` : ''}\n- Platform: ${os.platform()}`
    await M.reply(text)
}

module.exports.command = {
    name: 'stats',
    aliases: ['status'],
    category: 'music',
    usage: '',
    exp: 8,
    description: 'Bot Stats'
}
