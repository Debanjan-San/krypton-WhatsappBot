const blacksmith = {
    createsword: {
        iron: {
            id: 3,
            material: {
                wood: 5,
                iron: 7,
                string: 4
            },
            durability: 125
        },
        gold: {
            id: 4,
            material: {
                wood: 5,
                string: 4,
                gold: 7
            },
            durability: 150
        },
        diamond: {
            id: 6,
            material: {
                wood: 5,
                string: 4,
                diamond: 7
            },
            durability: 200
        },
        emerald: {
            id: 7,
            material: {
                wood: 5,
                string: 4,
                emerald: 7
            },
            durability: 175
        }
    },
    createarmor: {
        iron: {
            id: 3,
            material: {
                wood: 5,
                iron: 7,
                string: 4
            },
            durability: 125
        },
        gold: {
            id: 4,
            material: {
                wood: 5,
                string: 4,
                gold: 7
            },
            durability: 150
        },
        diamond: {
            id: 6,
            material: {
                wood: 5,
                string: 4,
                diamond: 7
            },
            durability: 502
        },
        emerald: {
            id: 7,
            material: {
                wood: 5,
                string: 4,
                emerald: 7
            },
            durability: 770
        }
    },
    createpickaxe: {
        iron: {
            id: 3,
            material: {
                wood: 5,
                iron: 7,
                string: 4
            },
            durability: 125
        },
        gold: {
            id: 4,
            material: {
                wood: 5,
                string: 4,
                gold: 7
            },
            durability: 550
        },
        diamond: {
            id: 6,
            material: {
                wood: 5,
                string: 4,
                diamond: 7
            },
            durability: 900
        },
        emerald: {
            id: 7,
            material: {
                wood: 5,
                string: 4,
                emerald: 7
            },
            durability: 1000
        }
    },
    createfishingrod: {
        normal: {
            id: true,
            material: {
                wood: 5,
                string: 15
            },
            durability: 150
        }
    }
}
const createlist = ['createsword', 'createpickaxe', 'createarmor', 'createfishingrod']

module.exports = {
    name: 'blacksmith',
    aliases: [...createlist],
    category: 'rpg',
    exp: 8,
    description: 'Blacksmith where weapons are made',
    async execute(client, arg, M) {
        const command = M.body.split(' ')[0].toLowerCase().slice(client.prefix.length).trim()
        if (command === 'blacksmith') {
            const objKeys = Object.keys(blacksmith)
            let text = '====🥢 BLACKSMITH🥢====\n\n'
            for (const v of objKeys) {
                const list = Object.fromEntries(Object.entries(blacksmith[v]))
                const __list = Object.keys(list)
                const typeEmoji = ['⚔️', '🛡️', '⛏️', '🎣']
                let items = ''
                for (const abc of __list) {
                    let material = ''
                    for (let __c in blacksmith[v][abc].material) {
                        material += blacksmith[v][abc].material[__c] + __c + ' '
                    }
                    items += `\n\n📗 *Type*: ${client.utils.capitalize(
                        abc
                    )}\n⚖️ *Required*: ${material}\n💙 *Durability*: ${blacksmith[v][abc].durability}\n🪙 *Price*: ${
                        blacksmith[v][abc].durability * 5
                    }\n*Example*: ${client.prefix}${v} ${abc}\n\n`
                }
                text += `${typeEmoji[objKeys.indexOf(v)]} *${client.utils.capitalize(v, true)}* ${items}`
            }
            return M.reply(text)
        }
        const type =
            command == 'createsword'
                ? 'sword'
                : command == 'createarmor'
                ? 'armor'
                : command == 'createpickaxe'
                ? 'pickaxe'
                : 'fishingrod'
        if (await client.rpg.get(`${M.sender}[${type}]`))
            return M.reply(`👴🏽⛏️ : I see you still have ${type}, come when your ${type} is destroyed`)
        const metalType = Object.keys(blacksmith[command])
        if (!metalType.includes(arg.trim())) return M.reply('Please give a valid type!')
        const cradits = (await client.cradit.get(`${M.sender}.wallet`)) || 0
        for (const less in blacksmith[command][arg.trim()].material) {
            if (cradits - blacksmith[command][[arg.trim()]].durability * 5 < 0)
                return M.reply('You dont have that much in your wallet')
            let item = (await client.rpg.get(`${M.sender}[${less}]`)) || 0
            if (item - blacksmith[command][[arg.trim()]].material[less] < 0) {
                return M.reply(`You are short of ${less}\n`)
            } else {
                await client.rpg.set(`${M.sender}[${type}].type`, arg.trim())
                await client.rpg.set(`${M.sender}[${type}].durability`, blacksmith[command][arg.trim()].durability)
                await client.rpg.set(
                    `${M.sender}[${less}]`,
                    item - blacksmith[command][[arg.trim()]].material[less] * 1
                )
                return M.reply(
                    `👴🏽⛏️ : Looks like I managed to make your ${arg.trim()} ${type} with durability ${
                        blacksmith[command][arg.trim()].durability
                    }`
                )
            }
        }
    }
}
