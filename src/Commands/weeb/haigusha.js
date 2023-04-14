const axios = require('axios')

module.exports = {
    name: 'haigusha',
    aliases: ['hg'],
    category: 'weeb',
    exp: 5,
    description: 'Summons a random anime character to marry',
    async execute(client, arg, M) {
        const haigusha = await axios.get(`https://reina-api.vercel.app/api/mwl/random`)
        let text = '========*HAIGUSHA*========\n'
        text += `*Name:* ${haigusha.data.data.name}\n`
        text += `*Japanese*: ${haigusha.data.data.original_name}\n`
        text += `*Romaji_name:* ${haigusha.data.data.romaji_name}\n`
        text += `*Slug:* ${haigusha.data.data.slug}\n`
        text += `*Likes_count:* ${haigusha.data.data.likes.count}\n`
        text += `*Like_rank:* ${haigusha.data.data.likes.rank}\n`
        text += `*Trash_count:* ${haigusha.data.data.trash.count}\n`
        text += `*Trash_rank:* ${haigusha.data.data.trash.rank}\n`
        text += `*Gender:* ${haigusha.data.data.gender}\n`
        text += `*NSFW:* ${haigusha.data.data.nsfw}\n`
        text += `*Vtuber:* ${haigusha.data.data.is_vtuber}\n`
        text += `*Origin:* ${haigusha.data.data.origin}\n`
        text += `*Age:* ${haigusha.data.data.age}\n`
        text += `*Popularity_rank:* ${haigusha.data.data.popularity_rank}\n`
        text += `*Birthday:* ${haigusha.data.data.birthday}\n`
        text += `*Height:* ${haigusha.data.data.height}\n`
        text += `*Weight:* ${haigusha.data.data.weight}\n`
        text += `*Blood_type:* ${haigusha.data.data.blood_type}\n`
        text += `*Breast:* ${haigusha.data.data.bust}\n`
        text += `*Waist:* ${haigusha.data.data.waist}\n`
        text += `*Hip:* ${haigusha.data.data.hip}\n`
        text += `*Tags:* ${haigusha.data.data.tags.join(', ')}\n`
        text += `*Url:* ${haigusha.data.data.url}\n\n`
        text += `*Description:* ${haigusha.data.data.description}\n\n========================\n`
        client.sendMessage(M.from, {
            image: {
                url: haigusha.data.data.image
            },
            caption: text
        })
    }
}
