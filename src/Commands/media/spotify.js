const { spotifydl } = require('../../Library/Spotify')

module.exports.execute = async (client, flag, arg, M) => {
    const link = M.urls[0]
    if (!link.includes('https://open.spotify.com/track/'))
        return M.reply('🟥 *Please use command with a valid spodify link*')
    const audioSpotify = await spotifydl(link.trim()).catch((err) => {
        return M.reply(err.toString())
        client.log(err, 'red')
    })

    if (spotifydl.error) return M.reply(`🟨 *Error Fetching: ${link.trim()}. Check if the url is valid and try again*`)
    M.reply('🟩 *Downloading has started please have some pesence*')

    const caption = `🎧 *Title: ${audioSpotify.data.name || ''}*\n\n🎤 *Artists: ${(
        audioSpotify.data.artists || []
    ).join(', ')}*\n\n💽 *Album: ${audioSpotify.data.album_name}*\n\n📆 *Release Date: ${
        audioSpotify.data.release_date || ''
    }*`

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

module.exports.command = {
    name: 'spotify',
    aliases: ['sp'],
    category: 'media',
    usage: '[link]',
    exp: 5,
    description: 'Downloads given spotify track and sends it as Audio'
}
