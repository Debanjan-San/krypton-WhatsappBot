const { getStats } = require('../../lib/stats')
const sortArray = require('sort-array')

module.exports = {
    name: 'leaderboard',
    aliases: ['lb'],
    category: 'general',
    exp: 5,
    description: "Displays global's or group's leaderboord of a specific field\nEx: lb gold gc",
    async execute(client, arg, M) {
        const group = ['gc', 'group']
        const economy = ['gold', 'economy']
        const term = arg.split(' ')
        const groupMetadata = await client.groupMetadata(M.from)
        const groupMembers = groupMetadata?.participants.map((x) => x.id.split('.whatsapp.net')[0]) || []
        const users = !economy.includes(term[0])
            ? Object.values(await client.exp.all()).map((x) => ({ user: x.id, xp: x.value.whatsapp.net })) || []
            : Object.values(await client.cradit.all()).map((x) => ({
                  user: x.id,
                  wallet: x.value.whatsapp.net.wallet || 0,
                  bank: x.value.whatsapp.net.bank || 0
              }))
        const sortUsers = !economy.includes(term[0])
            ? sortArray(users, {
                  by: 'xp',
                  order: 'desc'
              })
            : sortArray(users, {
                  by: 'total',
                  order: 'desc',
                  computed: {
                      total: (cradit) => cradit.wallet + cradit.bank
                  }
              })
        const leaderboard = group.includes(term[1] || arg)
            ? sortUsers.filter((x) => groupMembers.includes(x.user))
            : sortUsers

        if (leaderboard.length < 10) return M.reply('Sorry there is no enough users to create a leaderboard')
        const myPosition = leaderboard.findIndex((x) => x.user == M.sender.split('.whatsapp.net')[0])
        // console.log(myPosition, M.sender)
        let text = `☆☆💥 LEADERBOARD 💥☆☆\n\n*${
            (await client.contact.getContact(M.sender, client)).username
        }'s Position is ${myPosition + 1}*`
        for (let i = 0; i < 10; i++) {
            const level = (await client.DB.get(`${leaderboard[i].user}.whatsapp.net_LEVEL`)) || 1
            const { requiredXpToLevelUp, rank } = getStats(level)
            const username = (await client.contact.getContact(leaderboard[i].user, client)).username.whatsapp.net
            const experience = (await client.exp.get(leaderboard[i].user)).whatsapp.net || 0
            text += `\n\n*>${i + 1}*\n`
            text += `🏮 *Username: ${username}*#${leaderboard[i].user.substring(
                3,
                7
            )}\n〽️ *Level: ${level}*\n⭐ *Exp: ${experience}*\n💫 *Rank: ${rank}* ${
                economy.includes(term[0]) ? `\n💰 *Cradit: ${leaderboard[i].wallet + leaderboard[i].bank}*` : ''
            }`
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
}
//M.quoted.mtype === 'imageMessage',
