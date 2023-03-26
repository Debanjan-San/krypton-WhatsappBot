module.exports = {
    name: 'tagall',
    aliases: ['everyone'],
    admin: true,
    public: false,
    exp: 18,
    category: 'moderation',
    description: 'Tag all the users present in the group',
    async execute(client, arg, M) {
        const groupMetadata = await client.groupMetadata(M.from)
        const groupMembers = groupMetadata?.participants || []

        let Users = []

        for (const id of groupMembers) {
            Users.push(id)
        }
        await client.sendMessage(M.from, { text: arg || `HIDE TAG`, mentions: Users }, { quoted: M })
    }
}
