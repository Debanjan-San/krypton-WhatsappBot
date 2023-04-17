const { SlotMachine, SlotSymbol } = require('slot-machine')

module.exports = {
    name: 'slot',
    aliases: ['bet'],
    category: 'economy',
    exp: 5,
    description: 'Bets the given amount of gold in a slot machine',
    async execute(client, arg, M) {
        const symbols = [
            new SlotSymbol('a', {
                display: '🍒',
                points: 1,
                weight: 100
            }),
            new SlotSymbol('b', {
                display: '🍊',
                points: 1,
                weight: 100
            }),
            new SlotSymbol('c', {
                display: '🍌',
                points: 5,
                weight: 40
            })
        ]
        if (!arg) return M.reply('Please provide the amount')
        const amount = parseInt(arg)
        if (isNaN(amount)) return M.reply('Please provide the amount')
        if (arg.startsWith('-') || arg.startsWith('+')) return M.reply('Please provide the amount')
        const cradits = (await client.cradit.get(`${M.sender}.wallet`)) || 0
        if (cradits - amount < 0) return M.reply('You dont have that much in your wallet')
        const machine = new SlotMachine(3, symbols).play()
        const lines = machine.lines.filter((line) => !line.diagonal)
        const points = machine.lines.reduce((total, line) => total + line.points, 0)
        const resultAmount = points <= 0 ? -amount : amount * points
        await client.cradit.add(`${M.sender}.wallet`, resultAmount)
        let text = '🎰 *SLOT MACHINE* 🎰\n\n'
        text += machine.visualize()
        text += points <= 0 ? `\n\n📉 You lost ${amount} gold` : `\n\n📈 You won ${resultAmount} gold`
        M.reply(text)
    }
}
