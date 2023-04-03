const { capitalize, fetch, getBuffer, gifToMp4 } = require('../lib/function.js');

const suitableWords = {
  bite: 'Bit', blush: 'Blushed at', bonk: 'Bonked', bully: 'Bullied', cringe: 'Cringed at',
  cry: 'Cried in front of', cuddle: 'Cuddled', dance: 'Danced with', glomp: 'Glomped at', handhold: 'Held the hands of', happy: 'is Happied with',
  highfive: 'High-fived', hug: 'Hugged', kick: 'Kicked', kill: 'Killed', kiss: 'Kissed', lick: 'Licked',
  nom: 'Nomed', pat: 'Patted', poke: 'Poked', slap: 'Slapped', smile: 'Smiled at', smug: 'Smugged',
  wave: 'Waved at', wink: 'Winked at', yeet: 'Yeeted at'
};

const reactions = Object.keys(suitableWords)

module.exports = {
    name: 'reaction',
    description: "React to someone's message with a gif specified by the user.",
    category: 'fun',
    aliases: ['r', ...reactions],
    exp: 50,
    execute = async (client, arg, M) => {
        const text = args.join(' ').trim()
        const command = M.body.split(' ')[0].toLowerCase().slice(client.prefix.length).trim()
        let flag = true
        if (command === 'r' || command === 'reaction') flag = false
        if (!flag && !text) {
           const reactionList = `🎃 *Available Reactions:*\n\n- ${reactions.map((reaction) => capitalize(reaction)).join('\n- ')}\n🛠️ *Usage:* ${client.prefix}reaction (reaction) [tag/quote user] | ${client.prefix}(reaction) [tag/quote user]\nExample: ${client.prefix}pat`
           return void (await M.reply(reactionList))
        }
        const reaction = flag ? command : text.split(' ')[0].trim().toLowerCase()
        if (!flag && !reactions.includes(reaction))
           return void M.reply(`Invalid reaction. Use *${client.prefix}react* to see all of the available reactions`)
           const users = M.mentions
        if (M.quoted && !users.includes(m.quoted.sender)) users.push(M.quoted.sender)
        while (users.length < 1) users.push(M.sender)
        const reactant = users[0]
        const single = reactant === M.sender
        const { url } = await fetch(`https://api.waifu.pics/sfw/${reaction}`)
        const result = await getBuffer(url)
        const buffer = await gifToMp4(result)
        await client.sendMessage(M.from, {
           video: buffer,
           gifPlayback: true,
           caption: `*@${M.sender.split('@')[0]} ${suitableWords[reaction]} ${single ? 'Themselves' : `@${reactant.split('@')[0]}`}*`,
           mentions: [M.sender, reactant],
      }, { quoted: M });
   }
}
