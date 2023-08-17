const axios = require('axios')

module.exports.execute = async (client, flag, arg, M) => {
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

module.exports.command = {
    name: 'neko',
    aliases: ['catgirl'],
    category: 'weeb',
    usage: '',
    exp: 10,
    description: 'Sends an image of random neko'
}
