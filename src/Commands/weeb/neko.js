const axios = require('axios')

module.exports = {
    name: 'neko',
    aliases: ['catgirl'],
    category: 'weeb',
    exp: 10,
    description: 'Sends an image of random neko',
    async execute(client, arg, M) {
        const res = await axios.get(`https://nekos.life/api/v2/img/neko`).catch((err) => {
            return M.reply(err.toString())
        })
        client.sendMessage(M.from, {
            image: {
                url: res.data.url
            },
            caption: `_Neko Neko Ni~_`
        })
    }
}
