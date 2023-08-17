const { NEWS } = require('@consumet/extensions')

module.exports.execute = async (client, flag, arg, M) => {
    try {
        const news = await new NEWS.ANN().fetchNewsFeeds()
        for (let i = 0; i < 5; i++) {
            client.sendMessage(M.from, {
                image: {
                    url: news[i].thumbnail
                },
                caption: `📔 *Title: ${news[i].title}*\n\n💾 *ID: ${news[i].id}*\n\n🎋 *Topics: ${news[i].topics
                    .toString()
                    .replace(/,/g, '\n')}*\n\n⏱ *UploadedAt: ${news[i].uploadedAt}*\n\n📗 *Intro: ${
                    news[i].preview.intro
                }*\n\n✔ *Link: ${news[i].url}*\n\n⛩ *Description:* ${news[i].preview.full}`
            })
        }
    } catch (err) {
        M.reply(err.toString())
        client.log(err, 'red')
    }
}

module.exports.command = {
    name: 'aninews',
    aliases: ['animenews'],
    category: 'weeb',
    usage: '',
    exp: 15,
    description: 'Gives you news about anime'
}
