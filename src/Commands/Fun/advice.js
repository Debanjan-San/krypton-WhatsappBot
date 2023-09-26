const axios = require('axios')

module.exports.execute = async (client, flag, arg, M) => {
    await axios
        .get(`https://api.adviceslip.com/advice`)
        .then((response) => {
            // console.log(response);
            const text = `Advice for you: ${response.data.slip.advice}`
            M.reply(text)
        })
        .catch((err) => {
            M.reply(`🔍 Error: ${err}`)
        })
}

module.exports.command = {
    name: 'advice',
    aliases: ['adv'],
    category: 'fun',
    exp: 5,
    usage: '',
    description: 'Sends random advices'
}
