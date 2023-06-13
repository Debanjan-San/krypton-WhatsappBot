module.exports = {
    name: 'haigusha',
    aliases: ['hg'],
    category: 'weeb',
    exp: 5,
    description: 'Summons a random anime character to marry',
    async execute(client, flag, arg, M) {
        const result = await client.utils.fetch('https://reina-api.vercel.app/api/mwl/random')
        let text = '========*HAIGUSHA*========\n'
        text += `*Name:* ${result.data.name}\n`
        text += `*Japanese*: ${result.data.original_name}\n`
        text += `*Romaji_name:* ${result.data.romaji_name}\n`
        text += `*Slug:* ${result.data.slug}\n`
        text += `*Likes_count:* ${result.data.likes.count}\n`
        text += `*Like_rank:* ${result.data.likes.rank}\n`
        text += `*Trash_count:* ${result.data.trash.count}\n`
        text += `*Trash_rank:* ${result.data.trash.rank}\n`
        text += `*Gender:* ${result.data.gender}\n`
        text += `*NSFW:* ${result.data.nsfw}\n`
        text += `*Vtuber:* ${result.data.is_vtuber}\n`
        text += `*Origin:* ${result.data.origin}\n`
        text += `*Age:* ${result.data.age}\n`
        text += `*Popularity_rank:* ${result.data.popularity_rank}\n`
        text += `*Birthday:* ${result.data.birthday}\n`
        text += `*Height:* ${result.data.height}\n`
        text += `*Weight:* ${result.data.weight}\n`
        text += `*Blood_type:* ${result.data.blood_type}\n`
        text += `*Breast:* ${result.data.bust}\n`
        text += `*Waist:* ${result.data.waist}\n`
        text += `*Hip:* ${result.data.hip}\n`
        text += `*Tags:* ${result.data.tags.join(', ')}\n`
        text += `*Url:* ${result.data.url}\n\n`
        text += `*Description:* ${result.data.description}\n\n========================\n`
        client.sendMessage(M.from, {
            image: {
                url: result.data.image
            },
            caption: text
        })
    }
}
