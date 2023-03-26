module.exports = {
    name: 'alive',
    aliases: ['a'],
    category: 'music',
    exp: 0,
    description: 'Testing stuff',
    async execute(client, arg, M) {
        //console.log(M.mentions.includes((client.user.id).split(':')[0] + '@s.whatsapp.net'))
        //console.log((client.user.id).split(':')[0] + '@s.whatsapp.net')
        M.reply(
            `Everything is working ${
                (await client.contact.getContact(M.sender, client)).username
            } | *Exp:* ${await client.exp.get(M.sender)}`
        )
    }
}
//M.quoted.mtype === 'imageMessage',
