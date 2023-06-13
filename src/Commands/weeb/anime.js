const axios = require('axios')

module.exports = {
    name: 'anime',
    aliases: ['ani'],
    category: 'weeb',
    exp: 5,
    description: 'Gives you the info of the anime',
    async execute(client, flag, arg, M) {
        if (!arg) return M.reply('Sorry you did not give any search term!')
        const res = await axios.get(`https://api.jikan.moe/v4/anime?q=${arg}`)
        if (res.data.data.length == 0) return M.reply('404 Error could not find the given term')

        let text = '========*ANIME*========\n\n'
        text += `*Name:* ${res.data.data[0].title_english}\n`
        text += `*Japanese*: ${res.data.data[0].title_japanese}\n`
        text += `*Duration:* ${res.data.data[0].duration}\n`
        text += `*Episodes:* ${res.data.data[0].episodes}\n`
        text += `*Description:* ${res.data.data[0].synopsis}\n\n========================\n`
        // M.reply(text);
        client.sendMessage(M.from, {
            image: {
                url: res.data.data[0].images.jpg.large_image_url
            },
            caption: text
        })
    }
}
