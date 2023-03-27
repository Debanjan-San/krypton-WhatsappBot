const Spotify = require('spotifydl-core').default
const spcanvas = require('spcanvas')
const TrackDetails = require('spotifydl-core/dist/lib/details/Track')

const credentials = {
    clientId: 'acc6302297e040aeb6e4ac1fbdfd62c3',
    clientSecret: '0e8439a1280a43aba9a5bc0a16f3f009'
}
const spotify = new Spotify(credentials)

const spotifydl = async (url) => {
    const res = await spotify.getTrack(url).catch(() => {
        return { error: 'Failed' }
    })
    const card = await new spcanvas.Spotify()
        .setAuthor(res.artists.join(', '))
        .setAlbum(res.album_name)
        .setBackground(
            'image',
            'https://c4.wallpaperflare.com/wallpaper/758/235/686/pewdiepie-felix-youtuber-hd-wallpaper-preview.jpg'
        )
        .setImage(res.cover_url)
        .setTimestamp(40000, 179000)
        .setTitle(res.name)
        .build()
    return { data: res, audio: await spotify.downloadTrack(url), coverimage: card.toBuffer() }
}

module.exports = {
    spotifydl
}
