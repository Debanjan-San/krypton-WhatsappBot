const TD = require('better-tord')

module.exports = {
    name: 'truth_dare',
    aliases: ['td'],
    category: 'fun',
    exp: 29,
    description: 'Gives you tuth and dare',
    async execute(client, arg, M) {
        const _ = ['truth', 'dare']
        if (!arg && !_.includes(arg)) return M.reply('Sorry you did not give any search term!')
        switch (arg) {
            case 'truth':
                return M.reply(TD.get_truth())
                break
            case 'dare':
                return M.reply(TD.get_dare())
                break
        }
    }
}
