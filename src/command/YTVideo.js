const YT = require('../lib/YT')

module.exports = {
    name: 'ytvideo',
    aliases: ['ytv'],
    category: 'media',
    exp: 5,
    description: 'Downloads given YT Video',
    async execute(client, arg, M) {
        if (!arg && !YT.validateURL(arg.trim())) return M.reply('Please use command with a valid youtube.com link')
        const { videoDetails } = await YT.getInfo(arg)
        M.reply('Downloading has started please have some pesence')
        let text = `*Title:* ${videoDetails.title} | *Type:* Video | *From:* ${videoDetails.ownerChannelName}`
        client.sendMessage(
            M.from,
            {
                image: {
                    url: `https://i.ytimg.com/vi/${videoDetails.videoId}/maxresdefault.jpg`
                },
                caption: text
            },
            {
                quoted: M
            }
        )
        if (Number(videoDetails.lengthSeconds) > 1800) return M.reply('Cannot download video longer than 30 minutes')
        const audio = YT.getBuffer(arg, 'video')
            .then(async (res) => {
                await client.sendMessage(
                    M.from,
                    {
                        document: res,
                        mimetype: 'video/mp4',
                        fileName: videoDetails.title + '.mp4'
                    },
                    {
                        quoted: M
                    }
                )
            })
            .catch((err) => {
                return M.reply(err)
                console.error(err)
            })
    }
}
//M.quoted.mtype === 'imageMessage',
