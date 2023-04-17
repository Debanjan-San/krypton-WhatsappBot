module.exports = {
    name: 'burntrash',
    aliases: ['destroy'],
    category: 'rpg',
    exp: 5,
    description: 'Destroy a specified item from the inventory',
    async execute(client, arg, M) {
        if (!arg) return M.reply('Please specify an item to destroy')
        const burnable = ['sword', 'armor', 'fishingrod', 'pickaxe']
        if (!burnable.includes(arg)) return M.reply('That item does not exist in game.')
        const inventory = await client.rpg.get(M.sender)
        if (!(arg in inventory)) return M.reply('You do not have that item in your inventory.')
        await client.rpg.delete(`${M.sender}[${arg}]`)
        const random = Math.floor(Math.random() * 50) + 1
        await client.cradit.add(`${M.sender}.wallet`, random)
        return M.reply(
            `You destroyed ${arg} from your inventory. You recived ${random} golds as a result of this action`
        )
    }
}
