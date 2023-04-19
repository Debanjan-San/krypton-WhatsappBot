const axios = require('axios')

module.exports = {
    name: 'anime',
    aliases: ['ani'],
    category: 'weeb',
    exp: 5,
    description: 'Gives you the info of the anime',
    async execute(client, arg, M) {
        if (!arg) return M.reply('Sorry you did not give any search term!')
        try {
            if (arg.split('/')[0] == 'https:' && arg.split('/')[2] == 'yugen.to' && arg.split('/')[3] == 'anime' && arg.split('/')[6] == 'watch') {
                const res = await axios.get(`https://yogapi.debanjan-san.repl.co/anime/info?link=${arg}`)
                if (!res.data) return M.reply('404 Error could not find the given term')
                let text = '========*ANIME*========\n\n'
                text += `*Name:* ${res.data.name}\n`
                text += `*Native:* ${res.data.native}\n`
                text += `*Studio:* ${res.data.studio}\n`
                text += `*Format:* ${res.data.format}\n`
                text += `*Status:* ${res.data.status}\n`
                text += `*Premired:* ${res.data.premired}\n`
                text += `*Genres:* ${res.data.genres}\n`
                text += `*Desc:* ${res.data.about}\n\n========*EPISORDS*========\n`

                res.data.episodes.forEach(element => {
                    text += `*EP:* ${element.id}\n`
                    text += `*Title:* ${element.ep_title}\n`
                    text += `*Link:* ${client.prefix}anime ${element.link}\n`
                });

                client.sendMessage(M.from, {
                    image: {
                        url: res.data.image.coverimage
                    },
                    caption: text
                })
            } else if (arg.split('/')[0] == 'https:' && arg.split('/')[2] == 'yugen.to' && arg.split('/')[3] == 'watch') {
                const res = await axios.get(`https://yogapi.debanjan-san.repl.co/anime/watch?link=${arg}`)
                if (!res.data) return M.reply('404 Error')
                M.reply(`
            *Stream:* ${res.data.stream}\n
            *Episodes:* ${res.data.download}\n
            `)
            } else {
                const res = await axios.get(`https://yogapi.debanjan-san.repl.co/anime/search?term=${arg}`)
                if (res.data.length == 0) return M.reply('404 Error')

                let text = '========*ANIME*========\n\n'
                for (let i = 0; i < res.data.length; i++) {
                    text += `*Name:* ${res.data[i].name}\n`
                    text += `*Link*: ${res.data[i].link}\n`
                    text += `${client.prefix}anime ${res.data[i].link}\n\n========================\n`
                }
                client.sendMessage(M.from, {
                    image: {
                        url: res.data[0].image
                    },
                    caption: text
                })
            }
        } catch (err) {
            console.error(err)
            return M.reply('error')
        }
    }
}
