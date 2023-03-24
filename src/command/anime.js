const axios = require('axios');

module.exports = {
    name: 'anime',
    aliases: ['ani'],
    category: 'weeb',
    description: 'Gives you the info of the anime',
    async execute(client, arg, M) {
        if (!arg) return M.reply("Sorry you did not give any search term!")
        const res = await axios.get(`https://weeb-api.vercel.app/anime?search=${arg}`)
        if (res.data == 0) return M.reply("404 Error could not find the given term");

        const anime = res.data[0];
        let text = "====*ANIME*====\n\n";
        text += `*Name:* ${anime.title.english}\n`
        text += `*Romaji*: ${anime.title.romaji}\n`
        text += `*Japanese*: ${anime.title.native}\n`
        text += `*AverageScore* ${anime.averageScore}\n`
        text += `*Popularity:* ${anime.popularity}\n`
        text += `*Duration:* ${anime.duration}\n`
        text += `*Episodes:* ${anime.episodes}\n`
        text += `*Genres*: ${(anime.genres).toString().replace(",", ", ")}\n`
        text += `*Description:* ${anime.description}\n\n========================\n`
        // M.reply(text);
        client.sendMessage(M.from, {
            image: {
                url: anime.imageUrl
            },
            caption: text
        })
    }
}