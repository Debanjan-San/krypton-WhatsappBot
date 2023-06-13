const axios = require('axios')

module.exports = {
    name: 'subreddit',
    aliases: ['sr'],
    category: 'utils',
    exp: 7,
    description: 'Sends an image of a random waifu',
    async execute(client, flag, arg, M) {
        if (!arg) return M.reply('Sorry you did not give any search term!')
        const nsfw = (await client.DB.get('nsfw')) || []
        const res = await axios.get(`https://meme-api.com/gimme/${arg}`)
        if (res.data.code == 404) return M.reply("This subreddit has no posts or doesn't exist")
        if (!nsfw.includes(M.from) && res.data.nsfw) return reply(`NSFW is not registered on this group`)
        const text = `*Title:* ${res.data.title}\n*Postlink:* ${res.data.postLink}\n*Subreddit:* ${res.data.subreddit}\n*Nsfw:* ${res.data.nsfw}\n*Spoiler:* ${res.data.spoiler}`
        client.sendMessage(M.from, {
            image: {
                url: res.data.url
            },
            caption: text
        })
    }
}
