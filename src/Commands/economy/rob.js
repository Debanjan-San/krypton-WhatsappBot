const ms = require('parse-ms')

module.exports = {
    name: 'rob',
    aliases: ['attack'],
    category: 'economy',
    exp: 5,
    description: 'Attend to rob the mentioned user',
    async execute(client, arg, M) {
        if (M.quoted?.participant) M.mentions.push(M.quoted.participant)
        if (!M.mentions.length) return M.reply('*You must mention someone to attend the robbery*')
        const time = 90000
        const lastRob = await client.cradit.get(`${M.sender}.lastrob`)
        if (time - (Date.now() - lastRob) > 0) {
            const timeLeft = ms(time - (Date.now() - lastRob))
            //return M.reply(
            //`You robbed recently Try again in ${timeLeft.minutes} minute(s), ${timeLeft.seconds} second(s).`
            //)
        }
        const senderCradits = (await client.cradit.get(`${M.sender}.wallet`)) || 0
        const mentionCradits = (await client.cradit.get(`${M.mentions[0]}.wallet`)) || 0
        if ((senderCradits - 500) < 0) return M.reply('*You dont have that much in your wallet to pay*')
        if ((mentionCradits - 500) < 0) return M.reply('*The user dont have that much money in wallet*')
        const getResultByProbability = (n) => {
            if (Math.random() < n) return 'success'
            return 'caught'
        }
        await client.cradit.set(`${M.sender}.lastrob`, Date.now())
        const result = getResultByProbability(0.1)
        let targetAmount = Math.floor(Math.random() * (senderCradits - 250) + 250)
        if (senderCradits >= 10000) targetAmount = Math.floor(Math.random() * 10000)
        let userAmount = Math.floor(Math.random() * (mentionCradits - 250) + 250)
        if (userAmount >= 10000) userAmount = Math.floor(Math.random() * 10000)
        await client.cradit.add(`${M.sender}.wallet`, result === 'success' ? targetAmount : -userAmount)
        await client.cradit.add(`${M.mentions[0]}.wallet`, result === 'success' ? -targetAmount : userAmount)
        const text =
            result === 'caught'
                ? `you got caught and paid *${userAmount} gold* to *@${M.mentions[0].split('@')[0]}*`
                : `*@${M.sender.split('@')[0]}* robbed *@${M.mentions[0].split('@')[0]
                }* and got away with *${targetAmount} gold!*`
        client.sendMessage(M.from, { text, mentions: [M.sender, M.mentions[0]] }, { quoted: M })
    }
}
