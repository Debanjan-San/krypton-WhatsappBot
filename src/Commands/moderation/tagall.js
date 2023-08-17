module.exports.execute = async (client, flag, arg, M) => {
    const groupMetadata = await client.groupMetadata(M.from)
    const groupMembers = groupMetadata?.participants.map((x) => x.id) || []
    const groupAdmins = groupMetadata.participants.filter((x) => x.admin).map((x) => x.id)

    let text = `${arg !== '' ? `🛒 *Message: ${arg}*\n\n` : ''}🎡 *Group:* ${groupMetadata.subject}\n👥 *Members:* ${
        groupMetadata.participants.length
    }\n📣 *Tagger: @${M.sender.split('@')[0]}*\n`

    const admins = []
    const members = []

    for (const jid of groupMembers) {
        if (groupAdmins.includes(jid)) {
            admins.push(jid)
            continue
        }
        members.push(jid)
    }

    for (let i = 0; i < admins.length; i++) text += `${i === 0 ? '\n\n' : '\n'}🌟 *@${admins[i].split('@')[0]}*`
    for (let i = 0; i < members.length; i++) text += `${i === 0 ? '\n\n' : '\n'}👤 *@${members[i].split('@')[0]}*`

    await client.sendMessage(M.from, { text, mentions: groupMembers }, { quoted: M })
}

module.exports.command = {
    name: 'tagall',
    aliases: ['everyone', 'ping'],
    exp: 18,
    usage: '[text]',
    category: 'moderation',
    description: 'Tag all the users present in the group'
}
