const google = require('googlethis')

module.exports = {
    name: 'imagesearch',
    aliases: ['imgs'],
    category: 'utils',
    exp: 7,
    description: 'Searches image from google.com',
    async execute(client, flag, arg, M) {
        if (!arg) return M.reply('Sorry you did not give any search term!')
        const nsfw = (await client.DB.get('nsfw')) || []
        const images = await google.image(arg, { safe: nsfw.includes(M.from) }).catch((err) => {
            return M.reply('Could not find the searched term')
        })
        client.sendMessage(M.from, {
            image: {
                url: images[0].url
            },
            caption: 'Here you go'
        })
    }
}
