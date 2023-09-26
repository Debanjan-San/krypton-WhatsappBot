const axios = require('axios')

module.exports.execute = async (client, flag, arg, M) => {
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

module.exports.command = {
    name: 'meme',
    aliases: ['gimeme'],
    category: 'fun',
    exp: 16,
    usage: '',
    description: 'Sends an image of random meme'
}
