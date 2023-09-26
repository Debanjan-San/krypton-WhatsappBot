const TD = require('better-tord')

module.exports.execute = async (client, flag, arg, M) => {
    if (!arg) return M.reply('🟥 *Sorry you did not give any search term!*')
    const Available = ['truth', 'dare']
    if (!Available.includes(arg.trim()))
        return M.reply(`🔷 *Please provide a valid terms\n\n*Available:* ${Available.join(', ')}*`)
    M.reply(arg == 'truth' ? await TD.get_truth() : await TD.get_dare())
}

module.exports.command = {
    name: 'truth_dare',
    aliases: ['td'],
    category: 'fun',
    exp: 9,
    usage: 'truth | dare',
    description: 'Gives you tuth and dare'
}
