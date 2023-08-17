module.exports.execute = async (client, flag, arg, M) => {
    if (!arg) return M.reply('🟥 *Sorry you did not give any term!*')
    if (!client.config.writesonicAPI) return M.reply('🟥 *You did not provided any api key for useage!*')
    await client.AI.WriteSonic_gpt(arg)
        .then((res) => M.reply(res.response.data.message))
        .catch((err) => {
            return M.reply(err.toString())
            client.log(err, 'red')
        })
}

module.exports.command = {
    name: 'gpt',
    aliases: ['g'],
    category: 'utils',
    usage: '[term]',
    exp: 5,
    description: 'Let you chat with GPT chat bot'
}
