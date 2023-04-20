const ms = require('parse-ms')
const monsters = [
    { level: 0, requirehealth: 20, name: 'crow' },
    { level: 0, requirehealth: 20, name: 'Bunny' },
    { level: 0, requirehealth: 20, name: 'Jungle snake' },
    { level: 1, requirehealth: 30, name: 'Goblin' },
    { level: 1, requirehealth: 30, name: 'Slime' },
    { level: 1, requirehealth: 30, name: 'Wolf' },
    { level: 2, requirehealth: 30, name: 'Nymph' },
    { level: 2, requirehealth: 30, name: 'Skeleton' },
    { level: 2, requirehealth: 30, name: 'Wolf' },
    { level: 3, requirehealth: 30, name: 'Baby Demon' },
    { level: 3, requirehealth: 30, name: 'Ghost' },
    { level: 3, requirehealth: 30, name: 'Zombie' },
    { level: 4, requirehealth: 40, name: 'Imp' },
    { level: 4, requirehealth: 40, name: 'Witch' },
    { level: 4, requirehealth: 40, name: 'Zombie' },
    { level: 5, requirehealth: 50, name: 'Ghoul' },
    { level: 5, requirehealth: 50, name: 'Giant Scorpion' },
    { level: 5, requirehealth: 50, name: 'Unicorn' },
    { level: 6, requirehealth: 60, name: 'Baby Robot' },
    { level: 6, requirehealth: 60, name: 'Sorcerer' },
    { level: 6, requirehealth: 60, name: 'Unicorn' },
    { level: 7, requirehealth: 60, name: 'Cecaelia' },
    { level: 7, requirehealth: 60, name: 'Giant Piranha' },
    { level: 7, requirehealth: 60, name: 'Mermaid' },
    { level: 8, requirehealth: 60, name: 'Giant Crocodile' },
    { level: 8, requirehealth: 70, name: 'Nereid' },
    { level: 8, requirehealth: 70, name: 'Mermaid' },
    { level: 9, requirehealth: 70, name: 'Demon' },
    { level: 9, requirehealth: 70, name: 'Harpy' },
    { level: 9, requirehealth: 70, name: 'Killer Robot' },
    { level: 10, requirehealth: 80, name: 'Dullahan' },
    { level: 10, requirehealth: 80, name: 'Manticore' },
    { level: 10, requirehealth: 80, name: 'Killer Robot' },
    { level: 11, requirehealth: 90, name: 'Baby Dragon' },
    { level: 11, requirehealth: 90, name: 'Young Dragon' },
    { level: 11, requirehealth: 90, name: 'Scaled Baby Dragon' },
    { level: 12, requirehealth: 90, name: 'Kid Dragon' },
    { level: 12, requirehealth: 90, name: 'Not so young Dragon' },
    { level: 12, requirehealth: 90, name: 'Scaled Kid Dragon' },
    { level: 13, requirehealth: 90, name: 'Definitely not so young Dragon' },
    { level: 13, requirehealth: 90, name: 'Teen Dragon' },
    { level: 13, requirehealth: 90, name: 'Scaled Teen Dragon' }
]
const damageCal = (partialValue, totalValue) => {
    const percentage = (100 * partialValue) / totalValue
    return Math.round(totalValue - percentage)
}

module.exports = {
    name: 'hunt',
    aliases: ['ht'],
    category: 'rpg',
    exp: 17,
    description: 'Hunt creatures',
    async execute(client, arg, M) {
        const lastHunttimeout = 900000
        const lastHunt = await client.DB.get(`${M.sender}.lastHunt`)
        if (lastHunt !== null && lastHunttimeout - (Date.now() - lastHunt) > 0) {
            const lastHunttime = ms(lastHunttimeout - (Date.now() - lastHunt))
            return M.reply(
                `*You have to wait ${lastHunttime.minutes} minute(s), ${lastHunttime.seconds} second(s) for another hunt*`
            )
        } else {
            const level = (await client.DB.get(`${M.sender}_LEVEL`)) || 1
            const level_monsters = monsters.filter((monster) => {
                return monster.level === level
            })
            const monster = level_monsters[Math.floor(Math.random() * level_monsters.length)]
            const health = (await client.rpg.get(`${M.sender}.health`)) || 100
            if ((health - monster.requirehealth) < 0)
                return M.reply(
                    `You do not have enough heath to hunt a *_Level: ${monster.level} monster_* with this much *_Health: ${health}_ (Needed Health: ${monster.requirehealth})*`
                )
            const armor = await client.rpg.get(`${M.sender}.armor.durability`)
            const armorType = await client.rpg.get(`${M.sender}.armor.type`)
            const sword = await client.rpg.get(`${M.sender}.sword.durability`)
            const swordType = await client.rpg.get(`${M.sender}.sword.type`)
            const requireArmor = ['diamond', 'emerald']
            if (!sword) return M.reply('Sorry you do not have any sword to fight')
            if (level > 6 && !requireArmor.includes(swordType))
                return M.reply('You do not have a high grade armor to fight the higher level monsters!!')
            await client.DB.set(`${M.sender}.lastHunt`, Date.now())
            M.reply('*Your hunting is processing. So please wait it will take 4 Minutes*')
            setTimeout(async () => {
                const amount_damage =
                    armorType == 'iron'
                        ? damageCal(5, monster.requirehealth)
                        : armorType == 'gold'
                            ? damageCal(7, monster.requirehealth)
                            : armorType == 'diamond'
                                ? damageCal(20, monster.requirehealth)
                                : armorType == 'emerald'
                                    ? damageCal(40, monster.requirehealth)
                                    : monster.requirehealth
                if (armor) {
                    const armor_damage = monster.requirehealth - amount_damage
                    if ((armor - monster.requirehealth) > 0) {
                        await client.rpg.sub(`${M.sender}.armor.durability`, armor_damage)
                        await client.rpg.sub(`${M.sender}.health`, amount_damage)
                    } else {
                        const getDamage = armor_damage - armor
                        console.log(getDamage)
                        await client.rpg.sub(`${M.sender}.health`, getDamage)
                        await client.rpg.delete(`${M.sender}.armor`)
                        M.reply(`*Your 🛡️ *${armorType}* armor is broken now*`)
                    }
                } else await client.rpg.sub(`${M.sender}.health`, health - monster.requirehealth)
                const rewards = parseInt(Math.floor(Math.random() * 200 * monster.level))
                const rewards_quantity =
                    swordType == 'iron'
                        ? rewards * 2
                        : swordType == 'gold'
                            ? rewards * 4
                            : swordType == 'diamond'
                                ? rewards * 6
                                : swordType == 'emerald'
                                    ? rewards * 8
                                    : rewards
                await client.rpg.sub(`${M.sender}.sword.durability`, 1)
                if ((sword - 1) == 0) M.reply(`Your 🗡️ *${swordType}* broke`) && client.rpg.delete(`${M.sender}.sword`)
                await client.rpg.add(`${M.sender}.monster_valuables`, rewards_quantity)
                M.reply(
                    `*Congratulations 🎉 you collected ${rewards_quantity} valuables from hunting monsters*\n*Now you have ❤️ _Health:_ ${await client.rpg.get(
                        `${M.sender}.health`
                    )}*`
                )
            }, 240000)
        }
    }
}