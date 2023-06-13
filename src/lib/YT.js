const ytdl = require('youtubedl-core')
const { validateURL, getInfo } = require('youtubedl-core')
const { createWriteStream, readFile } = require('fs-extra')
const { tmpdir } = require('os')
const axios = require('axios')
const crypto = require('crypto')

// Generating a random file name
const generateRandomFilename = (length) =>
    crypto
        .randomBytes(Math.ceil(length / 2))
        .toString('hex')
        .slice(0, length)

//Downloading the video or audio file and returning it as a buffer
const getBuffer = (url, type) => {
    const filename = `${tmpdir()}/${generateRandomFilename(12)}.${type === 'audio' ? 'mp3' : 'mp4'}` // generate a random file name
    const stream = createWriteStream(filename)
    ytdl(
        url,
        { filter: type === 'audio' ? 'audioonly' : 'videoandaudio' },
        { quality: type === 'audio' ? 'highestaudio' : 'highest' }
    ).pipe(stream) // Download the video or audio and pipe it to the write stream
    return new Promise((resolve, reject) => {
        stream.on('finish', () => {
            readFile(filename).then(resolve).catch(reject)
        })
        stream.on('error', reject) // if there is an error with the write stream, reject the promise with the error
    })
}

// parsing the video ID from a YouTube video URL
const parseId = (url) => {
    const split = url.split('/')
    if (url.includes('youtu.be')) return split[split.length - 1]
    return url.split('=')[1]
}

module.exports = {
    validateURL,
    getInfo,
    getBuffer,
    parseId
}
