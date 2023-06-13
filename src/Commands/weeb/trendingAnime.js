const axios = require('axios')

module.exports = {
    name: 'trendinganime',
    aliases: ['ta', 'trendani'],
    category: 'weeb',
    exp: 4,
    description: 'Gives you the list of trending anime',
    async execute(client, flag, arg, M) {
        const res = await axios.get(`https://api.consumet.org/meta/anilist/trending`)
        const trends = res.data.results
        for (let i = 0; i < trends.length; i++) {
            let text = '====*TRENDING ANIME*====\n\n'
            text += `*Name:* ${trends[i].title.english}\n`
            text += `*Romanji:* ${trends[i].title.romaji}\n`
            text += `*Japanese*: ${trends[i].title.native}\n`
            text += `*Status:* ${trends[i].status}\n`
            text += `*Rating:* ${trends[i].rating}\n`
            text += `*ReleaseDate:* ${trends[i].releaseDate}\n`
            text += `*Genres*: ${trends[i].genres.join(', ')}\n`
            text += `*TotalEpisodes:* ${trends[i].totalEpisodes}\n`
            text += `*Duration:* ${trends[i].duration}\n`
            text += `*Type:* ${trends[i].type}\n`
            text += `*Description:* ${trends[i].description}\n\n========================\n`
            // M.reply(text);
            client.sendMessage(M.from, {
                image: {
                    url: trends[i].image
                },
                caption: text
            })
        }
    }
}
