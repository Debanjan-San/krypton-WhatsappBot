module.exports = {
    name: 'gpt',
    aliases: ['g'],
    category: 'utils',
    exp: 5,
    description: 'Let you chat with GPT chat bot',
    async execute(client, flag, arg, M) {
        if (!arg) return M.reply('Sorry you did not give any term!')
        if (!client.writesonicAPI) return M.reply('You did not provided any api key for OpenAI useage!')
        await client.AI.WriteSonic_gpt(arg)
            .then((res) => M.reply(res.response.data.message))
            .catch((err) => {
                return M.reply(err.toString())
                client.log(err, 'red')
            })
    }
}
