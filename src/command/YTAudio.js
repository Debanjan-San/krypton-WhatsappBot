const YT = require('../lib/YT')

module.exports = {
    name: 'ytaudio',
    aliases: ['yta'],
    category: 'media',
    exp: 5,
    description: 'Downloads given YT Video and sends it as Audio',
    async execute(client, arg, M) {
        if (!arg) return M.reply('Please use command with a valid youtube.com link')
        if (!YT.validateURL(arg.trim())) return M.reply('Please use command with a valid youtube.com link')
        const { videoDetails } = await YT.getInfo(arg)
        M.reply('Downloading has started please have some pesence')
        let text = `*Title:* ${videoDetails.title} | *Type:* Audio | *From:* ${videoDetails.ownerChannelName}`
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
        if (Number(videoDetails.lengthSeconds) > 1800) return M.reply('Cannot download audio longer than 30 minutes')
        const audio = YT.getBuffer(arg, 'audio')
            .then(async (res) => {
                await client.sendMessage(
                    M.from,
                    {
                        document: res,
                        mimetype: 'audio/mpeg',
                        fileName: videoDetails.title + '.mp3'
                    },
                    {
                        quoted: M
                    }
                )
            })
            .catch((err) => {
                return M.reply(err.toString())
                console.error(err)
            })
    }
}
//M.quoted.mtype === 'imageMessage',
