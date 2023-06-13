const { translate } = require('bing-translate-api')
const languages = require('bing-translate-api/src/lang.json')

module.exports = {
    name: 'translate',
    aliases: ['tl'],
    category: 'utils',
    exp: 0,
    description: 'Translates a text to a spacific language',
    async execute(client, flag, arg, M) {
        const message = M.quoted ? M.quoted.message.conversation : arg
        const language = arg.split('-')[1] || 'en'
        if (!message) return M.reply('Reply to a text message!')
        if (!Object.keys(languages).includes(language))
            return M.reply(
                'Translation for ' +
                    language +
                    ' is unavailable\n\n' +
                    'AVAILABLE LANGUAGE\n\n```' +
                    Object.keys(languages).join('```, ')
            )
        translate(message.split('-')[0], null, language)
            .then((res) => {
                M.reply(res.translation)
            })
            .catch((err) => {
                console.log(err)
            })
    }
}
