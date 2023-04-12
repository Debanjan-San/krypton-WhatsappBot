const session = require('../../../session.json')

module.exports = {
    name: 'session',
    aliases: ['see'],
    category: 'dev',
    exp: 0,
    description: 'Gives you the session',
    async execute(client, arg, M) {
        M.reply(JSON.stringify(session))
    }
}
