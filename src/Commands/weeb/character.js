const axios = require('axios')

module.exports.execute = async (client, flag, arg, M) => {
    if (!arg) return M.reply('🟥 *Sorry you did not give any search term!*')
    const chara = await axios.get(`https://api.jikan.moe/v4/characters?q=${arg}`)
    if (chara.data.data.length == 0) return M.reply('🟨 *Could not find*')

    let text = ''
    text += `📔 *Name: ${chara.data.data[0].name}*\n\n`
    text += `💮 *Japanese: ${chara.data.data[0].name_kanji}*\n\n`
    text += `⛩ *Favorites: ${chara.data.data[0].favorites}*\n\n`
    text += `💾 *Mal_ID: ${chara.data.data[0].mal_id}*\n\n`
    text += `📊 *Description:* ${chara.data.data[0].about}`
    // M.reply(text);
    client.sendMessage(M.from, {
        image: {
            url: chara.data.data[0].image.jpg.image_url
        },
        caption: text
    })
}

module.exports.command = {
    name: 'character',
    aliases: ['char'],
    category: 'weeb',
    usage: '[term]',
    exp: 5,
    description: 'Gives you the info of a character from anime'
}
