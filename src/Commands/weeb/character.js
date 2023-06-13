const axios = require('axios')

module.exports = {
    name: 'character',
    aliases: ['char'],
    category: 'weeb',
    exp: 5,
    description: 'Gives you the info of a character from anime',
    async execute(client, flag, arg, M) {
        if (!arg) return M.reply('Sorry you did not give any search term!')
        const chara = await axios.get(`https://api.jikan.moe/v4/characters?q=${arg}`)
        if (chara.data.data.length == 0) return M.reply('404 Error could not find the given term')

        let text = '====*CHARACTER*====\n\n'
        text += `*Name:* ${chara.data.data[0].name}\n`
        text += `*Japanese*: ${chara.data.data[0].name_kanji}\n`
        text += `*Favorites:* ${chara.data.data[0].favorites}\n`
        text += `*Mal_ID:* ${chara.data.data[0].mal_id}\n`
        text += `*Description:* ${chara.data.data[0].about}\n\n========================\n`
        // M.reply(text);
        client.sendMessage(M.from, {
            image: {
                url: chara.data.data[0].image.jpg.image_url
            },
            caption: text
        })
    }
}
