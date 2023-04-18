module.exports = {
    name: 'wallet',
    aliases: ['wal'],
    category: 'economy',
    exp: 5,
    description: 'Shows the wallet value',
    async execute(client, arg, M) {
        M.reply(
            `${(await client.contact.getContact(M.sender, client)).username} | *Wallet:* ${(await client.cradit.get(`${M.sender}.wallet`)) || 0
            }`
        )
    }
}
