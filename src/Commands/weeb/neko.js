const axios = require('axios')

module.exports = {
    name: 'neko',
    aliases: ['catgirl'],
    category: 'weeb',
    exp: 10,
    description: 'Sends an image of random neko',
    async execute(client, flag, arg, M) {
        const res = await axios.get(`https://api.waifu.pics/sfw/neko`).catch((err) => {
            return M.reply(err.toString())
            client.log(err, 'red')
        })
        client.sendMessage(M.from, {
            image: {
                url: res.data.url
            },
            caption: `_Neko Neko Ni~_`
        })
    }
}
