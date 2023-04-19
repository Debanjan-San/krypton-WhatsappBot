const ms = require('parse-ms')
const percentageCal = (partialValue, totalValue) => {
    const percentage = (100 * partialValue) / totalValue
    return Math.round(percentage)
}

module.exports = {
    name: 'fishing',
    aliases: ['fs'],
    category: 'rpg',
    exp: 7,
    description: 'Fishing to add stuff to the inventory',
    async execute(client, arg, M) {
        const fishingrod = await client.rpg.get(`${M.sender}.fishingrod`)
        if (!fishingrod) return M.reply("You don't have any fishingrod in your inventory")
        const lastfishingtimeout = 420000
        const lastfishing = await client.DB.get(`${M.sender}.fishingcooldown`)
        if (lastfishing !== null && lastfishingtimeout - (Date.now() - lastfishing) > 0) {
            const lastfishingtime = ms(lastfishingtimeout - (Date.now() - lastfishing))
            return M.reply(
                `*You have to wait ${lastfishingtime.minutes} minute(s), ${lastfishingtime.seconds} second(s) for another fishing round*`
            )
        }
        await client.DB.set(`${M.sender}.fishingcooldown`, Date.now())
        const items = ['fish', 'trash', 'potion', 'wood', 'string']
        const item = items[Math.floor(Math.random() * items.length)]
        const random =
            item === 'trash'
                ? percentageCal(2, fishingrod.durability) * 2
                : item === 'string'
                    ? percentageCal(3, fishingrod.durability) * 2
                    : item === 'fish'
                        ? percentageCal(5, fishingrod.durability) * 2
                        : item === 'potion'
                            ? percentageCal(9, fishingrod.durability) + 3
                            : percentageCal(11, fishingrod.durability) + 2
        const rewards = Math.round(Math.random() * 15)
        if ((parseInt(fishingrod.durability) - parseInt(random)) < 0) {
            await client.rpg.delete(`${M.sender}.fishingrod`)
            M.reply(`*Your fishingrod broke because ${random} damage*`)
        } else await client.rpg.sub(`${M.sender}.fishingrod.durability`, random)
        console.log(random)
        await client.rpg.set(`${M.sender}[${item}]`, rewards)
        M.reply(`You got _${rewards}-${client.utils.capitalize(item)}_ from fishing`)
    }
}
