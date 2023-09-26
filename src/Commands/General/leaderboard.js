const { getStats } = require('../../Library/stats')
const sortArray = require('sort-array')

module.exports.execute = async (client, flag, arg, M) => {
    const group = ['--gc', '--group']
    const groupMetadata = await client.groupMetadata(M.from)
    const groupMembers = groupMetadata?.participants.map((x) => x.id.split('.whatsapp.net')[0]) ?? []
    const exp = Object.values(await client.exp.all()) ?? []

    const users = exp.map((x) => ({
        user: x.id,
        xp: x.value.whatsapp.net
    }))

    const lb = sortArray(users, {
        by: 'xp',
        order: 'desc'
    })

    const filtered = group.includes(flag[0]) ? lb.filter((x) => groupMembers.includes(x.user)) : lb

    if (filtered.length < 10) return M.reply('🟥 *Sorry there is no enough users to create a leaderboard*')
    const myPosition = filtered.findIndex((x) => x.user == M.sender.split('.whatsapp.net')[0])
    let text = `☆☆💥 LEADERBOARD 💥☆☆\n\n*${
        (await client.contact.getContact(M.sender, client)).username
    }'s Position is ${myPosition + 1}*`
    for (let i = 0; i < 10; i++) {
        const level = (await client.DB.get(`${filtered[i].user}.whatsapp.net_LEVEL`)) ?? 1
        const { requiredXpToLevelUp, rank } = getStats(level)
        const username = (await client.contact.getContact(filtered[i].user, client)).username.whatsapp.net
        text += `\n\n*(${i + 1})*\n`
        text += `⛩ *Username: ${username}*#${filtered[i].user.substring(
            3,
            7
        )}\n〽️ *Level: ${level}*\n🎡 *Rank: ${rank}*\n⭐ *Exp: ${
            filtered[i].xp
        }*\n🍥 *RequiredXpToLevelUp: ${requiredXpToLevelUp} exp required*`
    }

    client.sendMessage(
        M.from,
        {
            video: {
                url: 'https://media.tenor.com/MqSOkI7a96cAAAPo/banner-discord.mp4'
            },
            caption: text,
            gifPlayback: true
        },
        {
            quoted: M
        }
    )
}

module.exports.command = {
    name: 'leaderboard',
    aliases: ['lb'],
    category: 'general',
    usage: '| --gc',
    exp: 5,
    description: "Displays global's or group's leaderboord of a specific field\nEx: lb --gc"
}
