const axios = require('axios')

module.exports = {
    name: 'waifu',
    aliases: ['animegirl'],
    category: 'weeb',
    exp: 7,
    description: 'Sends an image of a random waifu',
    async execute(client, flag, arg, M) {
        const res = await axios.get(`https://api.waifu.im/search/?included_tags=waifu`).catch((err) => {
            return M.reply(err.toString())
            client.log(err, 'red')
        })

        client.sendMessage(M.from, {
            image: {
                url: res.data.images[0].url
            },
            caption: `Waifu from ${res.data.images[0].source}`
        })
    }
}
