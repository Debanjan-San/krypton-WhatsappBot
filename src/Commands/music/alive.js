module.exports = {
    name: 'alive',
    aliases: ['a'],
    category: 'music',
    exp: 0,
    description: 'Testing stuff',
    async execute(client, flag, arg, M) {
        M.reply(
            `Everything is working ${
                (await client.contact.getContact(M.sender, client)).username
            } | *Exp:* ${await client.exp.get(M.sender)} *Level:* ${(await client.DB.get(`${M.sender}_LEVEL`)) || 0}`
        )
    }
}
