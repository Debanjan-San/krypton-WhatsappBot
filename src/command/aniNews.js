const axios = require('axios')

module.exports = {
    name: 'aninews',
    aliases: ['animenews'],
    category: 'weeb',
    exp: 15,
    description: 'Gives you news about anime',
    async execute(client, arg, M) {
        try {
            const response = await axios.get('https://tg-prev-scraper.deno.dev/anime_news')
            for (let i = 0; i < response.data.length; i++) {
                let text = ''
                text += `*Time:* ${response.data?.[i]?.time == '' ? 'N/A' : response.data?.[i]?.time.slice(0, 10)}\n`
                text += `*Views:* ${response.data?.[i]?.views == '' ? 'N/A' : response.data?.[i]?.views}\n`
                text += `*News:* ${response.data?.[i]?.text}\n`
                if (response.data?.[i]?.media?.[0] == null) await client.sendMessage(M.from, { text })
                else {
                    const buffer = await client.utils.getBuffer(response.data?.[i]?.media?.[0].replace(/'/gi, ''))
                    await client.sendMessage(M.from, {
                        image: buffer,
                        caption: text
                    })
                }
            }
        } catch (err) {
            console.error(err)
        }
    }
}
