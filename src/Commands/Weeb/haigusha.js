module.exports.execute = async (client, flag, arg, M) => {
    const result = await client.utils.fetch('https://reina-api.vercel.app/api/mwl/random')
    let text = ''
    text += `📔 *Name: ${result.data.name}*\n\n`
    text += `💮 *Japanese: ${result.data.original_name}*\n\n`
    text += `⛩ *Romaji_name: ${result.data.romaji_name}*\n\n`
    text += `💾 *Slug: ${result.data.slug}*\n\n`
    text += `👥 *Gender: ${result.data.gender}*\n\n`
    text += `⏰ *Age: ${result.data.age}*\n\n`
    text += `❤ *Popularity_rank: ${result.data.popularity_rank}*\n\n`
    text += `✔ *Tags: ${result.data.tags.join(', ')}*\n\n`
    text += `🔎 *Url: ${result.data.url}*\n\n`
    text += `📊 *Description:* ${result.data.description}`
    client.sendMessage(M.from, {
        image: {
            url: result.data.image
        },
        caption: text
    })
}

module.exports.command = {
    name: 'haigusha',
    aliases: ['hg'],
    category: 'weeb',
    usage: '',
    exp: 5,
    description: 'Summons a random anime character to marry'
}
