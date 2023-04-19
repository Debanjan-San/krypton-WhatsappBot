const items = {
    buy: [
        { potion: 1750 },
        { iron: 1000 },
        { gold: 3750 },
        { wood: 300 },
        { string: 100 },
        { diamond: 6150 },
        { emerald: 8050 }
    ],
    sell: [
        { potion: 1250 },
        { trash: 34 },
        { iron: 800 },
        { gold: 1750 },
        { wood: 300 },
        { string: 100 },
        { diamond: 3150 },
        { emerald: 4050 },
        { fish: 50 },
        { monster_valuables: 50 }
    ]
}

module.exports = {
    name: 'shop',
    aliases: ['sell', 'buy'],
    category: 'rpg',
    exp: 10,
    description: 'Buy or Sell any thing here',
    async execute(client, arg, M) {
        const command = M.body.split(' ')[0].toLowerCase().slice(client.prefix.length).trim()
        if (command == 'shop') {
            const typeEmoji = ['💰', '⚖️']
            const moneyEmoji = ['🪙', '💵']
            const types = Object.keys(items)
            let text = '======👔*SHOP*👔======'
            for (const type of types) {
                text += `\n\n*${typeEmoji[types.indexOf(type)]} ${client.utils.capitalize(type)}*\n`
                items[type].filter((x) => {
                    for (const [key, value] of Object.entries(x)) {
                        text += `\n> *${client.utils.capitalize(key)}:* ${value} ${moneyEmoji[types.indexOf(type)]}`
                    }
                })
            }
            text += `\n\n🎴 Use ${client.prefix}buy <item_name> / ${client.prefix}sell <item_name>\n📗 Example: ${client.prefix}buy potion/ ${client.prefix}sell potion`
            M.reply(text)
        }
        if (command == 'buy') {
            if (!arg) return M.reply('Please give a item name')
            const term = arg.split(' ')
            const buyItems = Object.keys(Object.assign({}, ...items[command]))
            if (!buyItems.includes(term[0].toLowerCase())) return M.reply('Please give a valid item name')
            const cradits = (await client.cradit.get(`${M.sender}.wallet`)) || 0
            const price =
                parseInt(Object.values(items[command][buyItems.indexOf(term[0].toLowerCase())]).join('')) *
                (term[1] || 1)
            if ((cradits - price) < 0)
                return M.reply(`You dont have that much in your wallet to buy ${term[0].toLowerCase()} ${term[1] || 1}`)
            await client.rpg.add(`${M.sender}[${term[0].toLowerCase()}]`, 1 * parseInt(term[1] || 1))
            await client.cradit.sub(`${M.sender}.wallet`, price)
            M.reply(
                `*Thank you 🎉 for your purches*\n*Now you have _${client.utils.capitalize(term[0])} : ${(await client.rpg.get(`${M.sender}[${term[0].toLowerCase()}]`)) || 0
                }_*`
            )
        }
        if (command == 'sell') {
            if (!arg) return M.reply('Please give a item name')
            const term = arg.split(' ')
            const sellItems = Object.keys(Object.assign({}, ...items[command]))
            if (!sellItems.includes(term[0].toLowerCase())) return M.reply('Please give a valid item name')
            const itemQuantity = await client.rpg.get(`${M.sender}[${term[0].toLowerCase()}]`)
            if (!itemQuantity) return M.reply('You do not have enough quantity to sell')
            const price = parseInt(Object.values(items[command][sellItems.indexOf(term[0].toLowerCase())]).join(''))
            await client.rpg.sub(
                `${M.sender}[${term[0].toLowerCase()}]`,
                'all' == term[1].toLowerCase() ? itemQuantity : 1
            )
            await client.cradit.add(`${M.sender}.wallet`, price * ('all' == term[1].toLowerCase() ? itemQuantity : 1))
            M.reply(
                `*Congratulations 🎉 you have gained ${price} by selling ${'all' == term[1].toLowerCase() ? itemQuantity : 1
                } ${client.utils.capitalize(term[0])}*\n*Now you have _${await client.cradit.get(
                    `${M.sender}.wallet`
                )}_ in your wallet*`
            )
        }
    }
}
