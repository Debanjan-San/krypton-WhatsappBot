module.exports = {
    name: 'createimg',
    aliases: ['ci'],
    category: 'utils',
    exp: 5,
    description: 'Let you create an image with openAI',
    async execute(client, arg, M) {
        if (!arg) return M.reply('Sorry you did not give any search term!')
        if (!client.openaiAPI) return M.reply('You did not provided any api key for OpenAI useage!')
        const results = await client.AI.createImage(arg).catch((err) => {
            return M.reply(err.toString())
        })
        for (let i = 0; i < results.response.data.data.length; i++) {
            client
                .sendMessage(M.from, {
                    image: {
                        url: results.response.data.data[i].url
                    },
                    caption: 'Image made using openAI'
                })
                .catch((err) => {
                    console.error(err)
                })
        }
        //M.reply(res.response);
        //console.log(results.response.data)
    }
}

