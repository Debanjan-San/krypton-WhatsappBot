module.exports = {
    name: 'gpt',
    aliases: ['g'],
    category: 'utils',
    description: 'Let you chat with GPT chat bot',
    async execute(client, arg, M) {
        const res = await client.AI.gpt(arg)
        M.reply(res.response);
    }
}
