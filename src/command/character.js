const axios = require('axios')

module.exports = {
    name: 'character',
    aliases: ['char'],
    category: 'weeb',
    exp: 5,
    description: 'Gives you the info of a character from anime',
    async execute(client, arg, M) {
        if (!arg) return M.reply('Sorry you did not give any search term!')
        const res = await axios.get(`https://weeb-api.vercel.app/character?search=${arg}`)
        if (res.data.characters == 0) return M.reply('404 Error could not find the given term')

        const character = res.data.characters[0]
        let text = '====*CHARACTER*====\n\n'
        text += `*Name:* ${character.name.full}\n`
        text += `*Japanese*: ${character.name.native}\n`
        text += `*Age:* ${character.age}\n`
        text += `*Gender:* ${character.gender}\n`
        text += `*BloodType:* ${character.bloodType}\n`
        text += `*DateOfBirth*: ${JSON.stringify(character.dateOfBirth).replace('{', '')}\n`
        text += `*Description:* ${character.description}\n\n========================\n`
        // M.reply(text);
        client.sendMessage(M.from, {
            image: {
                url: character.image.large
            },
            caption: text
        })
    }
}
