const settings = [
    {
        name: 'mods',
        description:
            'Enables the bot to remove the member which sent an invite link for other group (will work if and only if the bot is admin).'
    },
    {
        name: 'events',
        description: 'If enabled, the bot will listen for group events like new members joining, leaving, etc.'
    },
    {
        name: 'nsfw',
        description: 'If enabled, the bot will give access this group to use all the NSFW commands.'
    },
    {
        name: 'chatbot',
        description: 'If enabled, bot will automatically in your chat'
    },
    {
        name: 'invitelink',
        description: 'If enabled, the bot will give access to the invitelink command.'
    }
]
module.exports.execute = async (client, flag, arg, M) => {
    const option = ['--true', '--false']

    if (!option.includes(flag[0])) {
        return M.reply(
            `
        🔧 *Toggle Settings* 🔧

            ${settings
                .map(
                    ({ name, description }) =>
                        `🟢 *${name}* - ${description}\n\nTo turn on *${client.config.prefix}toggle ${name} --true*\nTo turn off *${client.config.prefix}toggle ${name} --false*`
                )
                .join('\n\n')}
            `
        )
    }
    if (!settings.map((x) => x.name).includes(arg)) return M.reply(`🟥 *Invalid setting*`)
    const Actives = (await client.DB.get(arg)) || []
    if (flag[0] === '--true') {
        if (Actives.includes(M.from)) return M.reply(`🟨 *${client.utils.capitalize(arg)} is already enabled*`)
        await client.DB.push(arg, M.from)
        return M.reply(`🟩 *Enabled "${client.utils.capitalize(arg)}"*`)
    }
    if (flag[0] === '--false') {
        if (!Actives.includes(M.from)) return M.reply(`🟨 *${client.utils.capitalize(arg)} is already disabled*`)
        await client.DB.pull(arg, M.from)
        return M.reply(`🟩 *Disabled "${client.utils.capitalize(arg)}"*`)
    }
    return M.reply(`🟥 *Invalid value*`)
}

module.exports.command = {
    name: 'toggle',
    aliases: ['tog'],
    exp: 10,
    category: 'moderation',
    usage: '[option] --true | --false',
    description: 'Activate certain features on group-chats'
}
