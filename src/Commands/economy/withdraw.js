module.exports = {
    name: 'withdraw',
    aliases: ['wt'],
    category: 'economy',
    exp: 5,
    description: 'Withdraws golds in your bank',
    async execute(client, arg, M) {
        if (!arg) return M.reply('Please provide the amount')
        const amount = parseInt(arg)
        if (isNaN(amount)) return M.reply('Please provide the amount')
        if (arg.startsWith('-') || arg.startsWith('+')) return M.reply('Please provide the amount')
        const cradits = (await client.cradit.get(`${M.sender}.bank`)) || 0
        if ((cradits - amount) < 0) return M.reply('You dont have that much in your wallet')
        await client.cradit.add(`${M.sender}.wallet`, amount)
        await client.cradit.sub(`${M.sender}.bank`, amount)
        M.reply(`You have successfully deposited ${amount} in your bank`)
    }
}
