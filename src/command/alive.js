module.exports = {
    name: 'alive',
    aliases: ['a'],
    description: 'Testing stuff',
    async execute(client, arg, M) {
        M.reply(`Everything is working ${(await client.contact.getContact(M.sender, client)).username}`);
    }
}
