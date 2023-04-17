const elements = {
    iron: {
        damage: 5,
        amount: Math.floor(Math.random() * 7) + 1
    },
    gold: {
        damage: 20,
        amount: Math.floor(Math.random() * 4) + 1
    },
    diamond: {
        damage: 10,
        amount: Math.floor(Math.random() * 3) + 1
    },
    emerald: {
        damage: 30,
        amount: Math.floor(Math.random() * 2) + 1
    }
}

module.exports = {
    name: 'mine',
    aliases: ['dig'],
    category: 'rpg',
    exp: 4,
    description: 'Get random elements from the mine and create stuff.',
    async execute(client, arg, M) {
        const cooldown = 300000
        const lastmine = await client.DB.get(`${M.sender}.mine`)
        const pickaxe = await client.rpg.get(`${M.sender}.pickaxe`)
        if (!pickaxe) return M.reply(`You don't have a pickaxe to mine!`)
        if (lastmine !== null && cooldown - (Date.now() - lastmine) > 0) {
            const lastminetime = ms(cooldown - (Date.now() - lastmine))
            return M.reply(
                `*You have to wait ${lastminetime.minutes} minute(s), ${lastminetime.seconds} second(s) for another mine*`
            )
        }
        const metals = Object.keys(elements)
        const element = metals[Math.floor(Math.random() * metals.length)]
        await client.DB.set(`${M.sender}.mine`, Date.now())
        if (parseInt(pickaxe.durability) - parseInt(elements[element].damage) < 0) {
            M.reply(`Your broke due to ${elements[element].damage} damage`)
            await client.rpg.delete(`${M.sender}.pickaxe.durability`)
            return
        } else await client.rpg.sub(`${M.sender}.pickaxe.durability`, `${elements[element].damage}`)
        await client.rpg.add(`${M.sender}[${element}]`, elements[element].amount)
        M.reply(
            `*You have collected _${elements[element].amount} ${element} elements_. Your pickaxe got ${
                parseInt(pickaxe.durability) - parseInt(elements[element].damage) < 0
                    ? 'broken'
                    : `${elements[element].damage} damage`
            }*`
        )
    }
}
//
