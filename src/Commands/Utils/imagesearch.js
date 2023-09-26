const google = require('googlethis')

module.exports.execute = async (client, flag, arg, M) => {
    if (!arg) return M.reply('🟥 *Sorry you did not give any search term!*')
    const nsfw = (await client.DB.get('nsfw')) || []
    const images = await google.image(arg, { safe: nsfw.includes(M.from) }).catch((err) => {
        return M.reply('🟨 *Could not find*')
    })
    client.sendMessage(M.from, {
        image: {
            url: images[0].url
        },
        caption: 'Here you go'
    })
}

module.exports.command = {
    name: 'imagesearch',
    aliases: ['imgs'],
    category: 'utils',
    usage: '[term]',
    exp: 7,
    description: 'Searches image from google.com'
}
