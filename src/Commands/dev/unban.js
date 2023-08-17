module.exports.execute = async (client, flag, arg, M) => {
    if (M.quoted?.participant) M.mentions.push(M.quoted.participant)
    if (!M.mentions.length) return M.reply('🟥 *Mentions are required to Unban*')
    const banned = (await client.DB.get('banned')) || []
    M.mentions.filter(async (user) =>
        banned.includes(user)
            ? (await client.DB.pull('banned', user)) &&
              (await client.sendMessage(
                  M.from,
                  { text: `🟩 *@${user.split('@')[0]}* is now unbanned`, mentions: [user] },
                  { quoted: M }
              ))
            : await client.sendMessage(
                  M.from,
                  { text: `🟨 *@${user.split('@')[0]}* is already unbanned`, mentions: [user] },
                  { quoted: M }
              )
    )
}

module.exports.command = {
    name: 'unban',
    aliases: ['unb'],
    exp: 0,
    usage: '[mention user | quote user]',
    category: 'dev',
    description: 'unans the taged user'
}
