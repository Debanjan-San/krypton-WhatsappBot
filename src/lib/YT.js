const ytdl = require('ytdl-core')
const { createWriteStream, readFile } = require('fs-extra')
const { tmpdir } = require('os')
const axios = require('axios')

const validateURL = (url) => ytdl.validateURL(url)

const getInfo = async (url) => await ytdl.getInfo(url)

const getBuffer = async (url, type) => {
    filename = `${tmpdir()}/${Math.random().toString(36)}.${type === 'audio' ? 'mp3' : 'mp4'}`
    const stream = createWriteStream(filename)
    ytdl(
        url,
        { filter: type === 'audio' ? 'audioonly' : 'videoandaudio' },
        { quality: type === 'audio' ? 'highestaudio' : 'highest' }
    ).pipe(stream)
    filename = await new Promise((resolve, reject) => {
        stream.on('finish', () => resolve(filename))
        stream.on('error', (err) => reject(err && console.log(err)))
    })
    return await readFile(filename)
}

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
