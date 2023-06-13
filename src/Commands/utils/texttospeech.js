const { getAudioUrl } = require('google-tts-api')
const languages = require('bing-translate-api/src/lang.json')

module.exports = {
    name: 'texttospeech',
    aliases: ['tts'],
    category: 'utils',
    exp: 0,
    description: 'Text to speech',
    async execute(client, flag, arg, M) {
        const message = M.quoted ? M.quoted.message.conversation : arg
        const language = arg.split('-')[1] || 'en'
        if (!message) return M.reply('Reply to a text message!')
        if (!Object.keys(languages).includes(language))
            return M.reply(
                'Speech for ' +
                    language +
                    ' is unavailable\n\n' +
                    'AVAILABLE LANGUAGE\n\n```' +
                    Object.keys(languages).join('```, ')
            )
        try {
            const url = getAudioUrl(message.split('-')[0], {
                lang: language,
                slow: false,
                host: 'https://translate.google.com'
            })
            client.sendMessage(
                M.from,
                {
                    audio: {
                        url
                    },
                    mimetype: 'audio/mpeg',
                    fileName: language + '.m4a'
                },
                {
                    quoted: M
                }
            )
        } catch (err) {
            return M.reply(err.message)
        }
    }
}
