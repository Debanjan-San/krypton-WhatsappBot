module.exports = {
    name: 'bank',
    aliases: ['bk'],
    category: 'economy',
    exp: 5,
    description: 'Shows the bank value',
    async execute(client, arg, M) {
        client.sendMessage(
            M.from,
            {
                image: await client.utils.generateCreditCardImage(
                    (
                        await client.contact.getContact(M.sender, client)
                    ).username,
                    '5/25'
                ),
                caption: `${(await client.contact.getContact(M.sender, client)).username} | *Bank:* ${(await client.cradit.get(`${M.sender}.bank`)) || 0
                    }`
            },
            {
                quoted: M
            }
        )
    }
}
