module.exports = {
    name: 'activate',
    aliases: ['act'],
    admin: true,
    public: false,
    botAdmin: true,
    exp: 10,
    category: 'moderation',
    description: 'Activate certain features on group-chats',
    async execute(client, arg, M) {
        const toggleableGroupActions = ['mod', 'events', 'invitelink', 'chatbot']
        if (!arg && !toggleableGroupActions.includes(arg.trim()))
            return M.reply(
                `Please provide a valid toggleable GroupActions\n\n*Available:* \n>${toggleableGroupActions.join('\n')}`
            )
        const Actives = (await client.DB.get(arg)) || []
        if (Actives.includes(M.from)) return M.reply(`${client.utils.capitalize(arg)} is already in your group`)
        await client.DB.push(arg, M.from)
        M.reply(`Success activating ${client.utils.capitalize(arg)} in your group`)
    }
}
