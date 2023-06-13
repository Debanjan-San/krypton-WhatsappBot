const TD = require('better-tord')

module.exports = {
    name: 'truth_dare',
    aliases: ['td'],
    category: 'fun',
    exp: 9,
    description: 'Gives you tuth and dare',
    async execute(client, flag, arg, M) {
        if (!arg) return M.reply('Sorry you did not give any search term!')
        const Available = ['truth', 'dare']
        if (!Available.includes(arg.trim()))
            return M.reply(`Please provide a valid terms\n\n*Available:* \n${Available.join('\n')}`)
        M.reply(arg == 'truth' ? await TD.get_truth() : await TD.get_dare())
    }
}
