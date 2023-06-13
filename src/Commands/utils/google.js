const axios = require('axios')
const Apikey = 'AIzaSyDMbI3nvmQUrfjoCJYLS69Lej1hSXQjnWI&cx=baf9bdb0c631236e5'

module.exports = {
    name: 'google',
    aliases: ['search'],
    category: 'utils',
    exp: 5,
    description: 'Search topics from google.com',
    async execute(client, flag, arg, M) {
        if (!arg) return M.reply('Sorry you did not give any search term!')
        const res = await axios
            .get(`https://www.googleapis.com/customsearch/v1?q=${arg}&key=${Apikey}`)
            .catch((err) => {
                return M.reply(err.toString())
            })
        if (res.data.items.length == 0) return reply('❌ Unable to find any result')
        const results = res.data.items

        let text = `====GOOGLE SEARCH====\n\n`
        for (const result of results) {
            text += `*Title:* ${result.title}\n`
            text += `*Description:* ${result.snippet}\n`
            text += `🌐 *Link:* ${result.link}\n\n========================\n`
        }
        M.reply(text)
    }
}
