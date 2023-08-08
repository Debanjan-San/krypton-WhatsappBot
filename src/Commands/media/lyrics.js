module.exports = {
    name: 'lyrics',
    category: 'media',
    exp: 50,
    description: 'Sends the lyrics of a given song',
    async execute(client, flag, arg, M) {
        if (!arg) return void M.reply('Provide the name of the song to search the lyrics')
        const term = arg.trim()
        const data = await client.utils.fetch(`https://weeb-api.vercel.app/genius?query=${term}`)
        if (!data.length) return void M.reply(`Couldn't find any lyrics | *"${term}"*`)
        const image = await client.utils.getBuffer(data[0].image)
        let caption = `🎊 *Title:* ${data[0].title} *(${data[0].fullTitle})*\n🖋️ *Artist:* ${data[0].artist}`
        const lyrics = await client.utils.fetch(`https://weeb-api.vercel.app/lyrics?url=${data[0].url}`)
        caption += `\n\n ${lyrics}`
        return void (await client.sendMessage(M.from, { image, caption }, { quoted: M }))
    }
}
