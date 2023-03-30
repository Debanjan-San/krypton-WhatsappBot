const axios = require('axios')

module.exports = {
    name: 'react',
    aliases: [
        'r',
        'cry',
        'kiss',
        'bully',
        'hug',
        'lick',
        'cuddle',
        'pat',
        'smug',
        'highfive',
        'bonk',
        'yeet',
        'blush',
        'wave',
        'smile',
        'handhold',
        'nom',
        'bite',
        'glomp',
        'kill',
        'slap',
        'cringe',
        'kick',
        'wink',
        'happy',
        'poke',
        'punch',
        'dance'
    ],
    category: 'fun',
    exp: 7,
    description: "let's react",
    async execute(client, arg, M) {
        const Reactions = {
            cry: ['Cried with', 'is Crying by'],
            kiss: ['Kissed'],
            bully: ['Bullied'],
            hug: ['Hugged'],
            lick: ['Licked'],
            cuddle: ['Cuddled with'],
            pat: ['Patted'],
            smug: ['Smugged at', 'is Smugging by'],
            highfive: ['High-fived'],
            bonk: ['Bonked'],
            yeet: ['Yeeted'],
            blush: ['Blushed at', 'is Blushing by'],
            wave: ['Waved at'],
            smile: ['Smiled at', 'is Smiling by'],
            handhold: ['is Holding Hands with'],
            nom: ['is Eating with', 'is Eating by'],
            bite: ['Bit'],
            glomp: ['Glomped'],
            kill: ['Killed'],
            slap: ['Slapped'],
            cringe: ['Cringed at'],
            kick: ['Kicked'],
            punch: ['Punched'],
            wink: ['Winked at'],
            happy: ['is Happy with', 'is Happy by'],
            poke: ['Poked'],
            dance: ['is Dancing with', 'is Dancing by']
        }
        let text = ''
        Object.keys(Reactions).map((reaction) => {
            text += `📍${reaction.charAt(0).toUpperCase() + reaction.slice(1)}\n`
        })
        text += `🎀 *Usage:* !(reaction) [tag/quote users]\nExample: !pat`
        if (M.cmdName === 'r' || M.cmdName === 'react') return M.reply(text)
        const res = await axios.get(`https://g.tenor.com/v1/search?q=${M.cmdName}&key=LIVDSRZULELA&limit=8`)
        if (M.quoted?.participant) M.mentions.push(M.quoted.participant)
        if (!M.mentions.length) M.mentions.push(M.sender)
        let grammar
        M.mentions[0] === M.sender
            ? (grammar = Reactions[`${M.cmdName}`].pop() || Reactions[`${M.cmdName}`][0])
            : (grammar = Reactions[`${M.cmdName}`][0])
        const single = M.mentions[0] === M.sender
        client.sendMessage(
            M.from,
            {
                video: {
                    url: res.data.results?.[Math.floor(Math.random() * res.data.results.length)]?.media[0]?.mp4?.url
                },
                caption: `*@${M.sender.split('@')[0]} ${grammar} ${
                    single ? 'Themselves' : `@${M.mentions[0].split('@')[0]}`
                }*`,
                mentions: [M.sender, M.mentions[0]],
                gifPlayback: true
            },
            {
                quoted: M
            }
        )
    }
}
