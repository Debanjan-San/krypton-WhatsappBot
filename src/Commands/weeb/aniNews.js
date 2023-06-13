const { NEWS } = require('@consumet/extensions')

module.exports = {
    name: 'aninews',
    aliases: ['animenews'],
    category: 'weeb',
    exp: 15,
    description: 'Gives you news about anime',
    async execute(client, flag, arg, M) {
        try {
            const news = await new NEWS.ANN().fetchNewsFeeds()
            for (let i = 0; i < 5; i++) {
                client.sendMessage(M.from, {
                    image: {
                        url: news[i].thumbnail
                    },
                    caption: `=====ANIME-NEWS=====\n*Title*: ${news[i].title}\n*ID*: ${news[i].id}\n*Topics*: ${news[
                        i
                    ].topics
                        .toString()
                        .replace(/,/g, '\n')}\n*UploadedAt*: ${news[i].uploadedAt}\n*Preview*:-\n\n*Intro*: ${
                        news[i].preview.intro
                    }\n\n*Description*: ${news[i].preview.full}\n*Link*: ${news[i].url}`
                })
            }
        } catch (err) {
            M.reply(err.toString())
            client.log(err, 'red')
        }
    }
}
