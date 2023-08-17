const axios = require('axios')

module.exports.execute = async (client, flag, arg, M) => {
    if (!arg) return M.reply('🟥 *Sorry you did not give any search term!*')
    const res = await axios.get(`https://api.jikan.moe/v4/anime?q=${arg}`)
    if (res.data.data.length == 0) return M.reply('🟨 *Could not find*')

    let text = ''
    text += `📔 *Name: ${res.data.data[0].title_english}*\n\n`
    text += `💮 *Japanese: ${res.data.data[0].title_japanese}*\n\n`
    text += `⏰ *Duration: ${res.data.data[0].duration}*\n\n`
    text += `⛩ *Episodes: ${res.data.data[0].episodes}*\n\n`
    text += `📊 *Description:* ${res.data.data[0].synopsis}`
    // M.reply(text);
    client.sendMessage(M.from, {
        image: {
            url: res.data.data[0].images.jpg.large_image_url
        },
        caption: text
    })
}

module.exports.command = {
    name: 'anime',
    aliases: ['ani'],
    category: 'weeb',
    usage: '[term]',
    exp: 5,
    description: 'Gives you the info of the anime'
}
