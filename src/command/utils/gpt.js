module.exports = {
    name: 'gpt',
    aliases: ['g'],
    category: 'utils',
    exp: 5,
    description: 'Let you chat with GPT chat bot',
    async execute(client, arg, M) {
        if (!arg) return M.reply('Sorry you did not give any term!')
        if (!client.openaiAPI) return M.reply('You did not provided any api key for OpenAI useage!')
        const res = await client.AI.gpt(arg).catch((err) => {
            return M.reply(err.toString())
        })
        M.reply(res.response)
    }
}
