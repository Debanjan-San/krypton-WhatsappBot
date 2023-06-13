module.exports = {
    name: 'leave',
    aliases: ['bye'],
    category: 'dev',
    exp: 0,
    description: 'Bot leaves the group',
    async execute(client, flag, arg, M) {
        client.groupLeave(M.from).catch((res) => M.reply('Something went wrong please check the link'))
    }
}
//M.quoted.mtype === 'imageMessage',
