module.exports.execute = async (client, flag, arg, M) => {
    const invitelink = (await client.DB.get('invitelink')) || []
    if (!invitelink.includes(M.from)) return M.reply(`🟨 *Invitelink is not registered on this group*`)
    const code = await client.groupInviteCode(M.from)
    M.reply('https://chat.whatsapp.com/' + code)
}

module.exports.command = {
    name: 'invite',
    aliases: ['inv', 'gclink', 'grouplink'],
    exp: 10,
    usage: '[link]',
    category: 'moderation',
    description: 'Get the group link'
}
