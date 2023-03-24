const axios = require('axios').default
const {
    tmpdir
} = require('os')
const {
    promisify
} = require('util')
const {
    exec
} = require('child_process')
const {
    readFile,
    unlink,
    writeFile
} = require('fs-extra')

/**
 * @param {string} url
 * @returns {Promise<Buffer>}
 */

const getBuffer = async (url) =>
    (
        await axios.get(url, {
            responseType: 'arraybuffer'
        })
    ).data

/**
 * @param {string} content
 * @param {boolean} all
 * @returns {string}
 */

const capitalize = (content, all = false) => {
    if (!all) return `${content.charAt(0).toUpperCase()}${content.slice(1)}`
    return `${content
            .split(' ')
            .map((text) => `${text.charAt(0).toUpperCase()}${text.slice(1)}`)
            .join(' ')}`
}

/**
 * @returns {string}
 */

const generateRandomHex = () => `#${(~~(Math.random() * (1 << 24))).toString(16)}`

/**
 * @param {string} content
 * @returns {number[]}
 */

const extractNumbers = (content) => {
    const search = content.match(/(-\d+|\d+)/g)
    if (search !== null) return search.map((string) => parseInt(string)) || []
    return []
}

/**
 * @param {string} url
 */

const fetch = async (url) => (await axios.get(url)).data

/**
 * @param {Buffer} webp
 * @returns {Promise<Buffer>}
 */

const webpToPng = async (webp) => {
    const filename = `${tmpdir()}/${Math.random().toString(36)}`
    await writeFile(`${filename}.webp`, webp)
    await this.exec(`dwebp "${filename}.webp" -o "${filename}.png"`)
    const buffer = await readFile(`${filename}.png`)
    Promise.all([unlink(`${filename}.png`), unlink(`${filename}.webp`)])
    return buffer
}

/**
 * @param {Buffer} webp
 * @returns {Promise<Buffer>}
 */

const webpToMp4 = async (webp) => {
    const filename = `${tmpdir()}/${Math.random().toString(36)}`
    await writeFile(`${filename}.webp`, webp)
    await this.exec(`magick mogrify -format gif ${filename}.webp`)
    const mp4 = await this.gifToMp4(await readFile(`${filename}.gif`), true)
    const buffer = await readFile(mp4)
    Promise.all([unlink(mp4), unlink(`${filename}.gif`), unlink(`${filename}.gif`)])
    return buffer
}

/**
 * @param {Buffer} gif
 * @param {boolean} write
 * @returns {Promise<Buffer | string>}
 */

const gifToMp4 = async (gif, write = false) => {
    const filename = `${tmpdir()}/${Math.random().toString(36)}`
    await writeFile(`${filename}.gif`, gif)
    await this.exec(
        `ffmpeg -f gif -i ${filename}.gif -movflags faststart -pix_fmt yuv420p -vf "scale=trunc(iw/2)*2:trunc(ih/2)*2" ${filename}.mp4`
    )
    if (write) return `${filename}.mp4`
    const buffer = await readFile(`${filename}.mp4`)
    Promise.all([unlink(`${filename}.mp4`), unlink(`${filename}.gif`)])
    return buffer
}

//const exec = promisify(exec)

const getRandomItem = (array) => {
    // get random index value
    const randomIndex = Math.floor(Math.random() * array.length);
    // get random item
    const item = array[randomIndex];
    return item;
}

const term = (param) => new Promise((resolve, reject) => {
    console.log('Run terminal =>', param)
    exec(param, (error, stdout, stderr) => {
        if (error) {
            console.log(error.message)
            resolve(error.message)
        }
        if (stderr) {
            console.log(stderr)
            resolve(stderr)
        }
        console.log(stdout)
        resolve(stdout)
    })
})

const restart = () => {
    setTimeout(function() {
        // UwU
        process.on('exit', function() {
            // eslint-disable-next-line @typescript-eslint/no-var-requires
            require('child_process').spawn(process.argv.shift(), process.argv, {
                cwd: process.cwd(),
                detached: true,
                stdio: 'inherit'
            })
        })
        process.exit()
    }, 2000)
}

module.exports = {
    restart,
    term,
    getRandomItem,
    exec,
    gifToMp4,
    webpToMp4,
    webpToPng,
    fetch,
    extractNumbers,
    generateRandomHex,
    capitalize,
    getBuffer
}
