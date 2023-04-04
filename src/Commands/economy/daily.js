const ms = require('parse-ms')

module.exports = {
    name: 'daily',
    aliases: ['rewards'],
    category: 'economy',
    exp: 5,
    description: 'Claims your daily rewards',
    async execute(client, arg, M) {
        const dailytimeout = 86400000
        const dailyamount = 1000
        const daily = await client.cradit.get(`${M.sender}.daily`)
        let text = ''
        if (daily !== null && dailytimeout - (Date.now() - daily) > 0) {
            const dailytime = ms(dailytimeout - (Date.now() - daily))
            text += `*You have already claimed your daily reward. you have to wait ${dailytime.hours} hour(s) ${dailytime.minutes} minute(s), ${dailytime.seconds} second(s)*`
        } else {
            text += `*You have claimed your Daily reward 🎉: ${dailyamount}*`
            await client.cradit.add(`${M.sender}.wallet`, dailyamount)
            await client.cradit.set(`${M.sender}.daily`, Date.now())
        }
        M.reply(text)
    }
}
