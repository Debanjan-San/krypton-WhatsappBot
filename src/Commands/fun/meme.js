const axios = require('axios')

module.exports = {
    name: 'meme',
    aliases: ['gimeme'],
    category: 'fun',
    exp: 16,
    description: 'Sends an image of random meme',
    async execute(client, flag, arg, M) {
        const res = await axios.get(`https://meme-api.com/gimme`).catch((err) => {
            return M.reply(err.toString())
        })
        client.sendMessage(M.from, {
            image: {
                url: res.data.url
            },
            caption: `${res.data.title}`
        })
    }
}
