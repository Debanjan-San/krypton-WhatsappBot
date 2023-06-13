const axios = require('axios')

module.exports = {
    name: 'getgif',
    aliases: ['gify'],
    category: 'utils',
    exp: 7,
    description: 'Searches gif',
    async execute(client, flag, arg, M) {
        if (!arg) return M.reply('Sorry you did not give any search term!')
        const res = await axios.get(`https://g.tenor.com/v1/search?q=${arg}&key=LIVDSRZULELA&limit=8`).catch(() => null)
        if (!res.data) return M.reply('Could not find')
        client.sendMessage(
            M.from,
            {
                video: {
                    url: res.data.results?.[Math.floor(Math.random() * res.data.results.length)]?.media[0]?.mp4?.url
                },
                caption: 'Here you go',
                gifPlayback: true
            },
            {
                quoted: M
            }
        )
    }
}
