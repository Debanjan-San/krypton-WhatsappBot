const { Ship } = require('@shineiichijo/canvas-chan')
const { writeFile } = require('fs-extra')

module.exports.execute = async (client, flag, arg, M) => {
    const shipArray = []
    let users = M.mentions
    if (M.quoted && !users.includes(M.quoted.participant)) users.push(M.quoted.participant)
    while (users.length < 2) users.push(M.sender)
    if (users.includes(M.sender)) users = users.reverse()

    for (const user of users) {
        const name = (await client.contact.getContact(user, client)).username
        let image
        try {
            image = await client.utils.getBuffer(await client.profilePictureUrl(user, 'image'))
        } catch {
            image = await client.utils.getBuffer(
                'https://icon2.cleanpng.com/20180703/lzk/kisspng-computer-icons-error-clip-art-checklist-5b3c119612f6e8.7675651415306633180777.jpg'
            )
        }
        shipArray.push({ name, image })
    }

    const percentage = Math.floor(Math.random() * 101)

    let text = ''
    if (percentage >= 0 && percentage < 10) text = 'Awful'
    else if (percentage >= 10 && percentage < 25) text = 'Very Bad'
    else if (percentage >= 25 && percentage < 40) text = 'Poor'
    else if (percentage >= 40 && percentage < 55) text = 'Average'
    else if (percentage >= 55 && percentage < 75) text = 'Good'
    else if (percentage >= 75 && percentage < 90) text = 'Great'
    else if (percentage >= 90) text = 'Amazing'

    let caption = `\`\`\`🔺Compatibility Meter🔺\`\`\``
    caption += `\n💖 *@${users[0].split('@')[0]}  x  @${users[1].split('@')[0]} 💖*\n`
    caption += `*🔻 ${percentage} ${percentage < 50 ? '💔' : '💞'} ${text}* 🔻`

    const image = await new Ship(shipArray, percentage, text).build()
    //user.substring(3, 7)
    client.sendMessage(
        M.from,
        {
            image,
            caption,
            mentions: [users[0], users[1]]
        },
        {
            quoted: M
        }
    )
}

module.exports.command = {
    name: 'ship',
    aliases: ['shipper'],
    category: 'fun',
    exp: 5,
    usage: '[mention user | quote user]',
    description: 'Ship People! ♥'
}
