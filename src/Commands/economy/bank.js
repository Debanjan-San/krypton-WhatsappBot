module.exports = {
    name: 'bank',
    aliases: ['bk'],
    category: 'economy',
    exp: 5,
    description: 'Shows the bank value',
    async execute(client, arg, M) {
        M.reply(
            `${(await client.contact.getContact(M.sender, client)).username} | *Bank:* ${
                (await client.cradit.get(`${M.sender}.bank`)) || 0
            }`
        )
    }
}
