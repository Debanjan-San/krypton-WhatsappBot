const axios = require('axios')

module.exports.execute = async (client, flag, arg, M) => {
    if (!arg) return M.reply('🟥 *Sorry you did not give any search term!*')
    const nsfw = (await client.DB.get('nsfw')) || []
    try {
        const res = await axios.get(`https://meme-api.com/gimme/${arg}`)
        if (res.data.code == 404) return M.reply('🟨 *Could not find*')
        if (!nsfw.includes(M.from) && res.data.nsfw) return reply(`🟨 *NSFW is not registered on this group*`)
        const text = `🖌️ *Title: ${res.data.title}*\n\n*👨‍🎨 Author: ${res.data.postLink}*\n\n*🎏 Subreddit: ${res.data.subreddit}*\n\n*🔞 NSFW: ${res.data.nsfw}*\n\n*🌐 Post: ${res.data.postLink}*\n\n*💢 Spoiler: ${res.data.spoiler}*`
        client.sendMessage(M.from, {
            image: {
                url: res.data.url
            },
            caption: text
        })
    } catch (err) {
        return M.reply('🟥 *Error !!*')
    }
}

module.exports.command = {
    name: 'subreddit',
    aliases: ['sr'],
    category: 'utils',
    usage: '[term]',
    exp: 7,
    description: 'Sends an image of a random waifu'
}
