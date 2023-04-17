module.exports = {
    name: 'health',
    aliases: ['lifes'],
    category: 'rpg',
    exp: 5,
    description: 'Show health information',
    async execute(client, arg, M) {
        M.reply(`*Your health is ❤️ ${(await client.rpg.get(`${M.sender}.health`)) || 100}*`)
    }
}
