// prettier-ignore
const suitableWords = {
    bite: 'Bit', blush: 'Blushed at', bonk: 'Bonked', bully: 'Bullied', cringe: 'Cringed at',
    cry: 'Cried in front of', cuddle: 'Cuddled', dance: 'Danced with', glomp: 'Glomped at', handhold: 'Held the hands of', happy: 'is Happied with',
    highfive: 'High-fived', hug: 'Hugged', kick: 'Kicked', kill: 'Killed', kiss: 'Kissed', lick: 'Licked',
    nom: 'Nomed', pat: 'Patted', poke: 'Poked', slap: 'Slapped', smile: 'Smiled at', smug: 'Smugged',
    wave: 'Waved at', wink: 'Winked at', yeet: 'Yeeted at'
}
const reactions = Object.keys(suitableWords)

module.exports.execute = async (client, flag, arg, M) => {
    const text = arg.trim()
    const command = M.body.split(' ')[0].toLowerCase().slice(client.config.prefix.length).trim()
    let raw = true
    if (command === 'r' || command === 'reaction') raw = false
    if (!raw && !text) {
        const reactionList = `🎃 *Available Reactions:*\n\n- ${reactions
            .map((reaction) => client.utils.capitalize(reaction))
            .join('\n- ')}\n🛠️ *Usage:* ${client.config.prefix}reaction (reaction) [tag/quote user] | ${
            client.config.prefix
        }(reaction) [tag/quote user]\nExample: ${client.config.prefix}pat`
        return await M.reply(reactionList)
    }
    const reaction = raw ? command : text.split(' ')[0].trim().toLowerCase()
    if (!raw && !reactions.includes(reaction))
        return M.reply(`Invalid reaction. Use *${client.config.prefix}react* to see all of the available reactions`)
    const users = M.mentions
    if (M.quoted && !users.includes(M.quoted.sender)) users.push(M.quoted.sender)
    while (users.length < 1) users.push(M.sender)
    const reactant = users[0]
    const single = reactant === M.sender
    const { url } = await client.utils.fetch(`https://api.waifu.pics/sfw/${reaction}`)
    const result = await client.utils.getBuffer(url)
    const buffer = await client.utils.gifToMp4(result)
    await client.sendMessage(
        M.from,
        {
            video: buffer,
            gifPlayback: true,
            caption: `*@${M.sender.split('@')[0]} ${suitableWords[reaction]} ${
                single ? 'Themselves' : `@${reactant.split('@')[0]}`
            }*`,
            mentions: [M.sender, reactant]
        },
        { quoted: M }
    )
}

module.exports.command = {
    name: 'reaction',
    description: "React to someone's message with a gif specified by the user.",
    category: 'fun',
    usage: ' | [mention user | quote user]',
    aliases: ['r', ...reactions],
    exp: 50
}
