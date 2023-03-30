const { spotifydl } = require('../lib/Spotify')

module.exports = {
    name: 'spotify',
    aliases: ['sp'],
    category: 'media',
    exp: 5,
    description: 'Downloads given spotify track and sends it as Audio',
    async execute(client, arg, M) {
        if (!arg) return M.reply('Please use command with a valid youtube.com link')
        const audioSpotify = await spotifydl(arg.trim()).catch((err) => {
            return M.reply(err.toString())
            console.error(err)
        })

        if (spotifydl.error) return M.reply(`Error Fetching: ${arg.trim()}. Check if the url is valid and try again`)
        M.reply('Downloading has started please have some pesence')

        const caption = `🎧 *Title:* ${audioSpotify.data.name || ''}\n🎤 *Artists:* ${(
            audioSpotify.data.artists || []
        ).join(', ')}\n💽 *Album:* ${audioSpotify.data.album_name}\n📆 *Release Date:* ${
            audioSpotify.data.release_date || ''
        }`

        client.sendMessage(
            M.from,
            {
                image: audioSpotify.coverimage,
                caption: caption
            },
            {
                quoted: M
            }
        )
        await client.sendMessage(
            M.from,
            {
                document: audioSpotify.audio,
                mimetype: 'audio/mpeg',
                fileName: audioSpotify.data.name + '.mp3'
            },
            {
                quoted: M
            }
        )
    }
}
//M.quoted.mtype === 'imageMessage',
